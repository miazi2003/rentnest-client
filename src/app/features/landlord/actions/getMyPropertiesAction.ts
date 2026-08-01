"use server";

import { getMyProperties } from "../../api/landlord.api";

export async function getMyPropertiesAction() {
const result =  await getMyProperties()
const myProperties = result.data?.data
console.log(myProperties , "my property test")
return myProperties
}
