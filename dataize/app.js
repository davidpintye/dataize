const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');
const url = require('url');
const express = require('express');
const Excel = require('exceljs');
const cors = require('cors');
const expApp = express();
const workbook = new Excel.Workbook();
const pre = '..';
// const pre = path.join('..', '..', '..');
const configFilePath = path.join(pre, 'config.json');
const configFile = require(path.join(configFilePath));
let win;
function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            devtools: true
        }
    })

    win.setMenu(null);
    win.maximize();

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'fe', 'index.html'),
        protocol: 'file:',
        slashes: true,
        webPreferences: {
            nodeIntegration: true,
            devtools: true
        }
    }));

    win.on('closed', () => {
        win = null;
    })
}

app.on('ready', createWindow);

expApp.use(express.urlencoded({ extended: false }));
expApp.use(express.json());
expApp.use(cors());

expApp.get('/getfileinfo', getFileInfo);
expApp.get('/getfilenames', getFileNames);
expApp.post('/createfile', createFile);
expApp.post('/openfile', openFile);
expApp.post('/updatepicsfold', updatePicsFold);
expApp.post('/deleteitem', deleteItem);
expApp.post('/deletefile', deleteFile);
expApp.post('/writeline', writeLine);
expApp.post('/downloadxlsx', downloadXlsx);

expApp.listen(3000);

function createFile(req, res) {
    try {
        fs.writeFileSync(path.join(pre, req.body.item, req.body.fileName + '.json'), JSON.stringify([]));
        writeConfigFile(req);
        forFileInfo(req.body.item, (fileName, picturePath, pics) => {
            res.json({
                "message": "File opened!",
                "data": file,
                "fileName": fileName,
                "picturePath": picturePath,
                "pics": pics
            });
        });
    } catch (error) {
        console.log(error);
        res.send(error);
    }
}

async function openFile(req, res, next) {
    let itemPath = path.join(pre, req.body.item, req.body.fileName + '.json');
    console.log(req.body);
    try {
        if (fs.existsSync(itemPath)) {
            let file = JSON.parse(readItemFile(req))
            addNo(file);
            file = JSON.stringify(file);
            writeConfigFile(req);
            forFileInfo(req.body.item, (fileName, picturePath, pics) => {
                res.json({
                    "message": "File opened!",
                    "data": file,
                    "fileName": fileName,
                    "picturePath": picturePath,
                    "pics": pics
                });
            });
        } else {
            throw new Error("File not found!")
        }
    } catch (error) {
        next(error);
    }
};

function updatePicsFold(req, res) {
    try {
        writeConfigFile(req);
        res.json({ "message": "Folder updated!" })
    } catch (error) {
        res.json(err);
    }
}

function deleteItem(req, res) {
    try {
        let file = readItemFile(req);
        file = JSON.parse(file);
        file.splice(req.body.index, 1);
        addNo(file);
        file = JSON.stringify(file);
        fs.writeFileSync(path.join(pre, req.body.item, req.body.fileName + '.json'), file);
        res.json({ "message": "Item deleted!" });
    } catch (error) {
        res.json(error);
    }
}

function getFileInfo(req, res) {
    try {
        forFileInfo(req.query.item, (fileName, picturePath) =>
            res.json({ fileName: fileName, path: picturePath })
        )
    } catch (error) {
        res.send(error);
    }

}

function forFileInfo(item, cd) {
    let fileName = configFile[item + 'FileName'];
    let picturePath = configFile[item + 'FilePath'];
    console.log(picturePath);
    console.log(fileName);
    cd(fileName, picturePath);
}

function getFileNames(req, res) {
    try {
        const files = fs.readdirSync(path.join(pre, req.query.path));
        res.send(files);
    } catch (error) {
        res.send(error);
    }
}

function readItemFile(req) {
    try {
        let file = fs.readFileSync(path.join(pre, req.body.item, req.body.fileName + '.json'), 'utf8');
        return file;
    } catch (error) {
        throw error;
    }
}

function writeLine(req, res) {
    try {
        const filePath = path.join(pre, req.body.item, req.body.fileName + '.json');
        const row = req.body.line;
        let fileContent = fs.readFileSync(filePath)
        let items = [];
        items = JSON.parse(fileContent);
        if (row.no) {
            items.splice(row.no - 1, 1, row);
        } else {
            items.push(row);
        }
        fs.writeFileSync(filePath, JSON.stringify(items));
        res.send({ "message": 'Item added!' });
    } catch (error) {
        res.send(error);
    }
}

function writeConfigFile(req) {
    try {
        if (req.body.fileName) configFile[req.body.item + "FileName"] = req.body.fileName;
        if (req.body.path) configFile[req.body.item + "FilePath"] = req.body.path;
        fs.writeFileSync(configFilePath, JSON.stringify(configFile));
    } catch (error) {
        throw error;
    }
    
};

function deleteFile(req, res) {
    try {
        let itemPath = path.join(pre, req.body.item, req.body.fileName + '.json');
        fs.unlinkSync(itemPath);
        res.json({ "message": "File deleted!" });
    } catch (error) {
        res.json(err);
    }
}

function addNo(file) {
    if (file.length > 0) {
        for (let i = 0; i < file.length; i++) {
            file[i].no = i + 1;
        }
    }
}

async function convertBookFileToXlsx(file, workbook) {
    for (let i = 0; i < file.length; i++) {
        let inscribed;
        let signed;
        console.log(file[i].signed);
        if (file[i].inscribed) inscribed = "Yes"; else inscribed = "No";
        if (file[i].signed) signed = "Yes"; else signed = "No";
        if(file[i].comment) issue = true;
        
        let row = [
            file[i].date,
            '',
            file[i].numberOfPics.length,
            '261186',
            file[i].price,
            file[i].condition,
            'F' + (i + 1),
            '13', '7', '3', '2', '0', 'True', '3.0', 'False',
            file[i].publish_date,
            file[i].country,
            file[i].title,
            file[i].subtitle,
            file[i].authors,
            file[i].publishers,
            file[i].language,
            file[i].isbn,
            file[i].format,
            file[i].features,
            file[i].edition,
            inscribed,
            signed,
            file[i].vintage,
            'No', 'No', 'No',
            file[i].comment
        ];
        console.log(row);
        workbook.worksheets[0].addRow(row);
    }
    
    await workbook.xlsx.writeFile(path.join(pre, 'templates', 'temp.xlsx'));
    return;
}

async function convertRecordFileToXlsx(file, workbook) {
    try {
        for (let i = 0; i < file.length; i++) {
            if (!file[i].year) file[i].year = "";
            let row = [
                file[i].date,
                '',
                file[i].numberOfPics.length,
                '176985',
                file[i].price,
                'Used', 'TBD', '13', '13', '1', '2', '0', 'True', '3.0', 'False',
                file[i].barcode,
                file[i].composer,
                file[i].artist,
                file[i].conductor,
                file[i].release_title,
                'Vinyl', 'Record',
                file[i].format,
                file[i].genre,
                file[i].label,
                '12"',
                file[i].speed,
                file[i].year,
                'Black',
                file[i].country,
                'No',
                file[i].comment
            ];
            workbook.worksheets[0].addRow(row);
        }
        await workbook.xlsx.writeFile(path.join(pre, 'templates', 'temp.xlsx'));
        return;
    } catch (error) {
        throw error;
    }
}

async function downloadXlsx(req, res) {
    workbook.xlsx.readFile(path.join(pre, 'templates', req.body.item + '_template.xlsx'))
        .then(async function () {
            let fileContent = fs.readFileSync(path.join(pre, req.body.item, req.body.fileName + '.json'), 'utf8')
            let file = JSON.parse(fileContent);
            if (req.body.item == 'book') {
                await convertBookFileToXlsx(file, workbook);
            }
            if (req.body.item == 'record') {
                await convertRecordFileToXlsx(file, workbook);
            }
        }).then(() => {
            res.download(path.join(pre, 'templates', 'temp.xlsx'));
        })
        .catch((err) => console.log(err));
}