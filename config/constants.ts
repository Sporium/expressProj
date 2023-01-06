export const JWT_KEY: string = process.env.SECRET_JWT_KEY || ''
export const AWS_ACCESS_KEY: string = process.env.AWS_ACCESS_KEY || ''
export const AWS_SECRET_ACCESS_KEY: string = process.env.AWS_SECRET_ACCESS_KEY || ''
export const AWS_BUCKET_NAME: string = 'nodeprojbucket'

export const publicImages =  `${process.cwd()}/public/images/`;
