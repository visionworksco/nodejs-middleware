export class MongoDbUtils {
  static toObjectId(objectIdholder: string): any {
    return (value: any, obj: any) => {
      return value ? value.toString() : obj[objectIdholder];
    };
  }

  static toArrayObjectId(objectIdholder: string): any {
    return (values: any[], obj: any) => {
      return values ? values.map((value) => value.toString()) : obj[objectIdholder];
    };
  }
}
