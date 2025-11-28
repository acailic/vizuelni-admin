declare module "inquirer" {
  const inquirer: any;
  export = inquirer;
}

declare module "table" {
  export function table(data: any[], options?: any): string;
}
