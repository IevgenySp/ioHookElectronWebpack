import "./style.css";

// Since ioHook added to WebPack externals (due to binaries .node backages)
// which can't be bundled it should be called from electron window global scope
const ioHook = window.require('iohook');

// init ipcRenderer to receive an ioHook events from Electron main process
const ipcRenderer = window.require('electron').ipcRenderer;

const build = () => {
    const mainElement = document.createElement("div");
    const ioHookRenderer = document.createElement("div");
    const ioHookMain = document.createElement("div");
    const rendererLabel = document.createElement("div");
    const mainLabel = document.createElement("div");
    const rendererData = document.createElement("div");
    const mainData = document.createElement("div");

    mainElement.setAttribute("id", "root");
    ioHookRenderer.setAttribute("class", "renderer");
    ioHookMain.setAttribute("class", "main");
    rendererLabel.setAttribute("class", "renderer-label");
    mainLabel.setAttribute("class", "main-label");
    rendererData.setAttribute("class", "renderer-data");
    mainData.setAttribute("class", "main-data");

    rendererLabel.innerHTML = 'ioHook in Electron renderer process:';
    mainLabel.innerHTML = 'ioHook in Electron main process:';

    ioHookRenderer.appendChild(rendererLabel);
    ioHookRenderer.appendChild(rendererData);
    ioHookMain.appendChild(mainLabel);
    ioHookMain.appendChild(mainData);

    mainElement.appendChild(ioHookRenderer);
    mainElement.appendChild(ioHookMain);

    document.body.appendChild(mainElement);

    ioHook.on('mousemove', event => {
        //console.log(event); // { type: 'mousemove', x: 700, y: 400 }
        rendererData.innerText = JSON.stringify(event);
    });

    ioHook.on('mouseclick', event => {
        rendererData.innerText = JSON.stringify(event);
    });

    // Register and start hook
    ioHook.start(true);

    // Listen ioHook events from main process
    ipcRenderer.on('mousemove', function (event,store) {
        mainData.innerText = JSON.stringify(store);
    });

    ipcRenderer.on('mouseclick', function (event,store) {
        mainData.innerText = JSON.stringify(store);
    });
};

build();
