const asyncHnadler = (requestHandler) =>{
    (req, res, next) =>{
        Promise.resolve(requestHandler(req, res, next))
        .catch((error)=>next(error))
    }
}

export { asyncHnadler}