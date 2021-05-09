import { WebDavClient } from "../webdav/webdavclient";
import { join } from "path";

require("dotenv").config();

async function test2() {
  const client = new WebDavClient();

  const list = await client.getDirectoryContents("/");
  console.log("Directory contents ->", list);

  const exists = await client.exists("/Data1/test");
  console.log("Directory exists ->", exists);

  const file = join(__dirname, "../../../../testfile.png");

  await client.writeFile(file, "/Data1/test");

  const exists2 = await client.exists("/Data1/test/testfile.png");
  console.log("uploaded file exists ->", exists2);
}

test2();
