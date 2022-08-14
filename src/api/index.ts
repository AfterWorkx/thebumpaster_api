import { Application, Request, Response } from 'express'
import { ServerCodes } from '../config/constants'
import deepMerge from 'deepmerge'
import { HealthRouter } from './v1/health'
import { UserRouter } from './v1/user'
import { AuthRouter } from './v1/auth'
import Logger from '../services/logger'
import { OrganizationRouter } from './v1/organization'
import { RoleRouter } from './v1/roles'
import { serve, setup } from 'swagger-ui-express'

const logger = Logger('API Router')

/**
 *
 */
export class APIRouter {
  /**
   *
   */
  public static versionMap: Map<
    string,
    {
      openAPIDocsMounted: boolean
      mounted: boolean
      openAPIDefinition?: {
        info?: { version: string; title: string; description: string }
      }
    }
  > = new Map()

  /**
   *
   * @param app
   * @param version
   * @param mountDocs
   */
  public static mountRoutes(
    app: Application,
    version: string,
    mountDocs = false
  ): void {
    if (APIRouter.versionMap.has(version)) {
      logger.warn('Trying to mount a stack that is already loaded!', version)
    } else {
      let definition = {}

      app.use('/services/api/' + version, new HealthRouter().getRouter())
      app.use('/services/api/' + version, new AuthRouter().getRouter())
      app.use('/services/api/' + version, new UserRouter().getRouter())
      app.use('/services/api/' + version, new RoleRouter().getRouter())
      app.use('/services/api/' + version, new OrganizationRouter().getRouter())

      definition = deepMerge(definition, HealthRouter.getOpenAPI())
      definition = deepMerge(definition, AuthRouter.getOpenAPI())
      definition = deepMerge(definition, UserRouter.getOpenAPI())
      definition = deepMerge(definition, RoleRouter.getOpenAPI())
      definition = deepMerge(definition, OrganizationRouter.getOpenAPI())

      APIRouter.versionMap.set(version, {
        mounted: true,
        openAPIDocsMounted: mountDocs,
        openAPIDefinition: definition,
      })

      if (mountDocs) {
        APIRouter.mountOpenAPIDocs(app, version)
      }

      logger.info(`API ${version} routes mounted successfully.`)
    }
  }

  /**
   *
   * @param app
   * @param _version
   */
  public static mountOpenAPIDocs(app: Application, _version: string): void {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { version, name, description } = require('../../package.json')

    const openAPIDefinition =
      APIRouter.versionMap.get(_version)?.openAPIDefinition

    if (openAPIDefinition?.info) {
      openAPIDefinition.info = { version, title: name, description }
    }

    app.get(
      '/services/api/' + _version + '/docs',
      (request: Request, response: Response) => {
        response.status(ServerCodes.SUCCESS)
        return response.json(openAPIDefinition)
      }
    )

    logger.info(`API ${_version} docs mounted successfully.`)
  }

  public static mountSwaggerUI(app: Application, versions: string[]): void {
    const urls = []

    for (const version of versions) {
      urls.push({
        name: 'API Version ' + version,
        url: '/services/api/' + version + '/docs',
      })
    }

    app.use(
      '/services/docs',
      serve,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setup(null, {
        explorer: true,
        swaggerOptions: {
          urls,
        },
      })
    )
  }
}
