import { $ } from "bun";
import ora from "ora";

const dbs_folder = "./dbs";

const check_dbs_folder_exists = async () => {
  const spinner = ora('Checking if "dbs" folder exists...').start();
  console.log("\n");

  const folder_exists = await $`test -d ${dbs_folder}`
    .then(() => true)
    .catch(() => false);

  if (!folder_exists) {
    spinner.text = "Creating dbs folder...";
    try {
      await $`mkdir ${dbs_folder}`;
      spinner.succeed("Successfully created dbs folder!");
      console.log("\n");
    } catch (error) {
      spinner.fail("Failed to create dbs folder. Check permissions.");
      console.log("\n");
    }
  } else {
    spinner.warn("The dbs folder already exists.");
  }

  await copy_env();
};

const copy_env = async () => {
  const spinner = ora('Copying "env" file...').start();
  console.log("\n");

  const file_exists = await $`test -f .env`.then(() => true).catch(() => false);

  try {
    if (file_exists) {
      spinner.warn("The .env file already exists.");
      return;
    }

    await $`cp .env.example .env`;
    spinner.succeed("Successfully copied .env file!");
    console.log("\n");
  } catch (error) {
    spinner.fail("Failed to copy .env file. Check permissions.");
    console.log("\n");
  }
};

await check_dbs_folder_exists();
