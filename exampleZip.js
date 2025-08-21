import AdmZip from "adm-zip";
const zip = new AdmZip();
zip.addFile("hello.txt", Buffer.from("Hello from TOBI AI App Builder!", "utf-8"));
zip.writeZip("example.zip");
console.log("Wrote example.zip");
