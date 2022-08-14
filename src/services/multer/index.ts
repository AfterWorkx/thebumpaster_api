import multer from 'multer';
import {resolve, extname} from "path";
import {v4} from "uuid";

const destination = resolve(__dirname, "../../../uploads");

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, destination)
    },
    filename: (req, file, callback ) => {
        callback(null, `${v4()}.${extname(file.originalname)}`)
    }
});

const multerMiddleware = multer({ storage });

/**
 *
 * @param inputName
 */
export const singleFileUpload = (inputName: string) => {
    return multerMiddleware.single(inputName);
}

/**
 *
 * @param inputName
 * @param maxNumberOfInputs
 */
export const multiFileUpload = (inputName: string, maxNumberOfInputs = 1000) => {
    return multerMiddleware.array(inputName, maxNumberOfInputs);
}