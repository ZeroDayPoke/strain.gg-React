// tokenTypes.d.ts

export interface TokenAttributes {
  id: number;
  userId: number;
  token: string;
  type: string;
  expiration: Date;
}
