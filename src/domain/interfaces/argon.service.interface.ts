export interface IArgonService {
    hashPassword(password:string):Promise<string>
    comparePassword(hash:string,plain:string):Promise<boolean>
}