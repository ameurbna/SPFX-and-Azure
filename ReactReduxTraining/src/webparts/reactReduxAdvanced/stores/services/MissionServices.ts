import Data from './Data';
import Mission from '../models/Mission';

export default class MissionServices{
   public static getAllMission():Promise<Mission[]> {
    return  new Promise((resolve, reject) => {
      resolve(Data);
    });
  }
  public static AddMission(newMission:Mission):Promise<Mission[]> {
    return  new Promise((resolve, reject) => {
      try {
        newMission.id=Data.length+1;
        (<Mission[]> Data).push(newMission);
        resolve(Data);
      } catch (error) {
        reject(error);
      }

    });
  }
  public static AddNewMision():Promise<Mission> {
    return  new Promise((resolve, reject) => {
      try {
        let newMission:Mission={
          id: Data.length + 1,
          Description:"",
          Location:"",
          Title:""
        } ;
        resolve(newMission);
      } catch (error) {
        reject(error);
      }

    });
  }


}
