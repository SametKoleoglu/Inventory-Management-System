import { ObjectId } from "mongodb";

// ObjectID doğrulama fonksiyonu
export function isValidObjectId(id: string): boolean {
  return ObjectId.isValid(id);
}
