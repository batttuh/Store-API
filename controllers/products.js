const Product=require('../models/product');
const getAllProductsStatic=async (req,res)=>{
    const products=await Product.find({featured:true}).sort("-name price");
    res.status(200).json({products,nbHits:products.length});

}
const getAllProducts=async (req,res)=>{
    const {featured,company,name,sort,fields,numericFilter}=req.query;
    const query={};
    if(featured){
        query.featured=featured==='true'?true:false;
    }
    if(company){
        query.company=company;
    }
    if(name){
        query.name={$regex:name,$options:'i'};
    }
    //numericFilter
    if(numericFilter){
        const operatorMap={
            ">":"$gt",
            "<":"$lt",
            ">=":"$gte",
            "<=":"$lte"
        }
        const regEx=/\b(<|>|>=|=|<|<=)\b/g;
        let filters=numericFilter.replace(regEx,(match)=>
            `-${operatorMap[match]}-`
        );
       // console.log(filters);
        const options=["price","rating"];
        filters=filters.split(',').forEach((item)=>{
            const[fields,operator,value]=item.split('-');
            if(options.includes(fields)){
                query[fields]={[operator]:Number(value)};
                console.log(query);
            }
        })
    }
    let result=Product.find(query);
    //sort
    if(sort){
        const sortList=sort.split(',').join(' ');
        result=result.sort(sortList);
        
    }else{
        result=result.sort('createAt');
    }
    
    //fields
    if(fields){
        const fieldsList=fields.split(',').join(' ');
        result=result.select(fieldsList);
    }
    
    const page=parseInt(req.query.page) || 1; //page number
    const limit=parseInt(req.query.limit) || 10; //10 products per page
    const skip=(page-1)*limit; //skip=(page-1)*limit
    result=result.skip(skip).limit(limit); //skip(skip) is used to skip the first n records
    const products=await result;
    res.status(200).json({products,nbHits:products.length});
} 
module.exports={
    getAllProductsStatic,
    getAllProducts
}