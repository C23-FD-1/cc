var body;
function uploadCSV() {
    const fileInput = document.getElementById("csvFileInput");
    const file = fileInput.files[0];
    if (file) {
        const formData = new FormData();
        formData.append("file", file);
        fetch("https://c913-114-122-77-17.ngrok-free.app/pred", {
            method: "POST",
            body: formData
        }).then(async (res)=>{
            body = await res.json();
            console.log(body.url);
        // generateTable10();
        }).catch((error)=>{
            console.error("Error:", error);
        });
    }
}
function generateTable10() {
    fetch("https://c913-114-122-77-17.ngrok-free.app/out/" + body.url).then((response)=>response.text()).then((csvData)=>{
        const tableContainer = document.getElementById("table-container");
        const table = document.createElement("table");
        const rows = csvData.split("\n");
        const headerRow = document.createElement("tr");
        rows[0].split(",").forEach((cellData)=>{
            const th = document.createElement("th");
            th.textContent = cellData;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);
        for(let i = 1; i < 11; i++){
            const rowData = rows[i].split(",");
            const row = document.createElement("tr");
            rowData.forEach((cellData)=>{
                const td = document.createElement("td");
                td.textContent = cellData;
                row.appendChild(td);
            });
            table.appendChild(row);
        }
        tableContainer.appendChild(table);
    }).catch((error)=>{
        console.error("Error:", error);
    });
}
function summary() {
    fetch("https://c913-114-122-77-17.ngrok-free.app/pred", {
        method: "GET"
    }).then((response)=>response.json()).then((data)=>{
        var readingsp = document.getElementById("reading-sp");
        var readinginp = document.getElementById("reading-input");
        var temp = " ";
        var temp2 = " ";
        for(let i = 0; i < data.length; i++){
            temp = data.scammer_percentage[i];
            readingsp.appendChild(temp);
            temp2 = data.scammer_count[i];
            readinginp.appendChild(temp2);
        }
    }).catch((error)=>{
        console.error("Error:", error);
    });
}
function downloadFile() {
    fetch(body.url).then((response)=>response.text()).then((csvData)=>{
        const csvFilename = "output.csv";
        const blob = new Blob([
            csvData
        ], {
            type: "text/csv;charset=utf-8"
        });
        if (typeof window.saveAs === "function") saveAs(blob, csvFilename);
        else {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = csvFilename;
            link.click();
        }
    }).catch((error)=>{
        console.error("Error:", error);
    });
}

//# sourceMappingURL=home.7c0ccee6.js.map
