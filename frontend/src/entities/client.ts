export interface Client {
    id?             : number
    full_name       : string
    animal_kind     : string
    animal_name     : string
    animal_gender   : string
    last_visit      : Date
    total_spent     : number
    total_visits    : number
    regular_customer: boolean
}