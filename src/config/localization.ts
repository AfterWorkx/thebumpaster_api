import {I18n, ConfigurationOptions} from 'i18n'
import {resolve} from "path";


const options: ConfigurationOptions= {
    locales: ['en', 'de', 'ba'],
    directory: resolve(__dirname, '../../locales'),
    defaultLocale: 'en',
    header: 'accept-language',
    objectNotation: true,
    autoReload: false,
    updateFiles: false,
    syncFiles: false,
}

const i18n = new I18n();
i18n.configure(options);

export default i18n;