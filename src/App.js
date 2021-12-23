import logo from './logo.svg';
import './App.css';
import SignaturePad from 'react-signature-canvas'
import { useState } from 'react';
import { PDFDocument } from 'pdf-lib'
import download from 'downloadjs';

function App() {
  var signPad = null;
  const onClick = () => {
    var signData = signPad.getTrimmedCanvas().toDataURL('image/png')
    createSignedPdf(signData);
  }

  const createSignedPdf = async (signData) => {
    const formUrl = 'https://pdf-lib.js.org/assets/dod_character.pdf'
    const formPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer())
    const pdfDoc = await PDFDocument.load(formPdfBytes)
    const pngImage = await pdfDoc.embedPng(signData);
    const pngDims = pngImage.scale(0.5);
    const pages = pdfDoc.getPages();
    const page = pages[0];
    page.drawImage(pngImage, {
      x: page.getWidth() / 2 - pngDims.width / 2,
      y: page.getHeight() / 2 - pngDims.height / 2 + 250,
      width: pngDims.width,
      height: pngDims.height,
    });
    const pdfBytes = await pdfDoc.save();
    download(pdfBytes, "test.pdf", "application/pdf");
  }

  const getPdf = async () => {
    const formUrl = 'https://pdf-lib.js.org/assets/form_to_flatten.pdf'
    const formPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer())
    console.log('PDF from URL', formPdfBytes)
    // var blob = new Blob(formPdfBytes, {type: 'application/pdf'});
    // var url = URL.createObjectURL(blob);
    // console.log(url)
  }

  return (
    <div className="App">
      <button onClick={onClick} >Sign</button>
      <div onClick className='container'>
      <div className='sigContainer'>
        <SignaturePad ref={(ref) => signPad = ref} canvasProps={{ className: 'sigPad' }}
           />
      </div>
    </div>
      <iframe src='https://pdf-lib.js.org/assets/with_update_sections.pdf' />

    </div>
  );
}

export default App;
