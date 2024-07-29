import bcrypt from "bcrypt";

export const hashData = async (data: any, saltRounds = 10) => {
    try { 
        const hashedData = await bcrypt.hash(data, saltRounds);
        return hashedData;

    } catch (error: any){
        return {
            status: false,
            message: error.message,
        };
    }
};

export const verifyHashedData = async (unhashed: any, hashed: any) => {
    try {
        const match = await bcrypt.compare(unhashed, hashed);
        return match;
    } catch (error: any) {
        console.log("Error in verifyHashedData:", error.message);
        return {
            status: false,
            message: error.message,
        };
    }
};


// module.exports = { hashData, verifyHashedData };

