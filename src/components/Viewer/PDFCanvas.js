import React, { useRef } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system/legacy";

const HTML = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
      html,body{margin:0;padding:0;background:#E8E4DC;}
      #wrap{padding:12px;}
      .page{background:white;border-radius:12px;margin:0 auto 12px auto;box-shadow:0 10px 25px rgba(0,0,0,0.12);overflow:hidden;}
      canvas{display:block;width:100%;height:auto;}
    </style>
  </head>
  <body>
    <div id="wrap"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <script>
      const wrap = document.getElementById('wrap');
      function post(type,payload){window.ReactNativeWebView?.postMessage(JSON.stringify({type,payload}));}
      async function renderPdf(uri){
        wrap.innerHTML="";
        pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        const pdf=await pdfjsLib.getDocument(uri).promise;
        post("pageCount",{pageCount:pdf.numPages});
        for(let i=1;i<=pdf.numPages;i++){
          const page=await pdf.getPage(i);
          const vp=page.getViewport({scale:1.5});
          const div=document.createElement("div");
          div.className="page";
          const canvas=document.createElement("canvas");
          canvas.width=vp.width;
          canvas.height=vp.height;
          div.appendChild(canvas);
          wrap.appendChild(div);
          await page.render({canvasContext:canvas.getContext("2d"),viewport:vp}).promise;
          post("pageSize",{pageNumber:i,width:vp.width,height:vp.height});
        }
      }
      document.addEventListener("message",(e)=>{
        try{const m=JSON.parse(e.data);if(m.type==="load"&&m.uri)renderPdf(m.uri);}catch{}
      });
      window.addEventListener("message",(e)=>{
        try{const m=JSON.parse(e.data);if(m.type==="load"&&m.uri)renderPdf(m.uri);}catch{}
      });
    </script>
  </body>
</html>`;

export default function PDFCanvas({ localUri, onPageCount, onPageSize }) {
  const webRef = useRef(null);

  function handleLoad() {
    (async () => {
      try {
        const b64 = await FileSystem.readAsStringAsync(localUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const dataUri = "data:application/pdf;base64," + b64;
        webRef.current?.postMessage(JSON.stringify({ type: "load", uri: dataUri }));
      } catch (e) {
        console.warn("PDFCanvas load error:", e);
      }
    })();
  }

  function handleMessage(e) {
    try {
      const msg = JSON.parse(e.nativeEvent.data);
      if (msg.type === "pageCount") onPageCount?.(msg.payload.pageCount);
      if (msg.type === "pageSize") onPageSize?.(msg.payload.pageNumber, {
        width: msg.payload.width,
        height: msg.payload.height,
      });
    } catch {}
  }

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webRef}
        originWhitelist={["*"]}
        source={{ html: HTML }}
        onLoadEnd={handleLoad}
        onMessage={handleMessage}
        style={{ backgroundColor: "#E8E4DC" }}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="always"
        allowFileAccess
        allowUniversalAccessFromFileURLs
      />
    </View>
  );
}