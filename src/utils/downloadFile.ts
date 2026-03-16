import { domToCanvas } from 'modern-screenshot';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';

import { len } from './util';

export function downloadFile(data: any, fileName: string): void {
  const blob = data instanceof Blob ? data : new Blob([data]);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export const toCanvasImage = async element => {
  const canvas = await domToCanvas(element, {
    scale: 1,
    backgroundColor: '#fff',
  });
  const canvasData = canvas.toDataURL('image/jpeg', 1);
  return canvasData;
};

/**将base64图片转成File对象 */
export const createFilesFromBase64 = async (base64Images: string[], names?: string[]) => {
  const files = await Promise.all(
    base64Images.map(async (base64, index) => {
      const base64Data = base64.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      return new File([blob], `${names?.[index] ?? 'image_' + index}.jpg`);
    }),
  );
  return files;
};

/**压缩并下载 */
export const compressAndDownload = async (files: File[], fileName?: string) => {
  const filesLen = len(files);
  if (filesLen <= 0) return;
  if (filesLen == 1) return saveAs(files[0]);
  const zip = new JSZip();
  files.forEach((file, index) => {
    zip.file(file.name || `image_${index + 1}.jpg`, file);
  });
  zip.generateAsync({ type: 'blob' }).then(content => {
    saveAs(content, (fileName ?? 'files') + '.zip');
  });
};

export const exportExcel = (columns, dataSource, fileName = '导出数据') => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  // 表头
  const headerTitles = columns.map(col => col.title);
  const headerRow = worksheet.addRow(headerTitles);

  headerRow.eachCell(cell => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' },
    };
    cell.font = {
      color: { argb: 'FFFFFFFF' },
      bold: true,
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
  });

  // 数据
  dataSource.forEach(item => {
    const rowData = columns.map(col => item[col.dataIndex]);
    worksheet.addRow(rowData);
  });

  workbook.xlsx.writeBuffer().then(buffer => {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, `${fileName}.xlsx`);
  });
};
