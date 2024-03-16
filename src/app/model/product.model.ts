export interface Product {
    id : string
    name : string
    price : number
    promotion : boolean
    selected? : boolean 
    /* hna drna ? bach selected tkon soit boolean aw undefined hit ila madrnahach ghadi ytlab lina n3amro 
    selected mnin nkono ghadi ncréyiw objet product */
}

export interface PageProduct {
    products : Product[]
    page : number
    size : number
    totalPages : number
}