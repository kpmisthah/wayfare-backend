export interface IArgonService {
    hashPassword(password:string):Promise<string>
    comparePassword(plain:string,hash:string):Promise<boolean>
}