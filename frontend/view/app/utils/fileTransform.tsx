import { CharacterTextSplitter } from "langchain/text_splitter";
import pdf from 'pdf-parse';
import fs from 'fs';


const pdfToText = async (filePath: string): Promise<string> => {
    const dataBuffer = fs.readFileSync(filePath);

    const data = await pdf(dataBuffer);
    const text = data.text;

    return text;

};

const fileTransfor = async (text:string) => {

    const pdfText = await pdfToText(text);
    
    const textSplitter = new CharacterTextSplitter({
        chunkSize: 100,
        chunkOverlap: 0,
    });

    const texts = await textSplitter.splitText(pdfText);
    console.log(texts)
    return texts;
}

export default fileTransfor;