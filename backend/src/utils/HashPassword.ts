import bcryptjs from 'bcryptjs'

export const HashPassword = async (password: string):Promise<boolean | string> => {
    try {
        const salt:string = await bcryptjs.genSalt(12)
        const hashedPassword = await bcryptjs.hash(password, salt)

        if(!hashedPassword){
            return false
        }

        return hashedPassword;
    } catch (error) {
        if(process.env.NODE_ENV as string !== 'production'){
            console.log("HashPassword: ", error)
            return false;
        }
        return false;
    }
}