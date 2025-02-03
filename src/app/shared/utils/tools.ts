export class Tools {
    static generateSlug = (value: string): string => value.toLocaleLowerCase().trim().replace(/[^a-z0-9-]+/g,'-').replace(/^-+|-+$/g,'');
}