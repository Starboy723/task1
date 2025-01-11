class ErrorGenerator extends Error{
    constructor(err,status){
        super(err);
        this.error=err;
        this.status=status;
    }
}

module.exports=ErrorGenerator;