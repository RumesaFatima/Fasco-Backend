import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Product from "./models/Product.js";
import User from "./models/User.js";

const px = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800`;
const PRODUCTS = [
  { id:"p01",name:"Denim Jacket",category:"Jackets",price:39,oldPrice:59,rating:4,reviews:3,colors:[{name:"Blue",hex:"#9db6c9"},{name:"Black",hex:"#1c1d22"},{name:"Pink",hex:"#e9b8c4"}],sizes:["M","L","XL","XXL"],stock:9,image:px(30632758),gallery:[px(30632758),px(19992666),px(18457838)],tags:["Jacket","Denim"],description:"Washed, soft-structured denim jacket with a relaxed cut." },
  { id:"p02",name:"Mini Dress With Ruffled Straps",category:"Dresses",price:14.9,oldPrice:29.99,rating:5,reviews:21,colors:[{name:"Red",hex:"#d8232a"}],sizes:["S","M","L"],stock:14,image:px(30590775),gallery:[px(30590775),px(31046828),px(30294790)],tags:["Dress"],description:"A flirty mini with ruffled straps and a bias cut." },
  { id:"p03",name:"Ruffled Tank Dress",category:"Dresses",price:32,rating:4,reviews:8,colors:[{name:"Aqua",hex:"#bfe3e0"},{name:"Black",hex:"#1c1d22"}],sizes:["S","M","L","XL"],stock:11,image:px(31046828),gallery:[px(31046828)],tags:["Dress","Tank"],description:"Clean-lined tank dress with sculpted ruffles." },
  { id:"p04",name:"Women Casual Dress",category:"Dresses",price:32,oldPrice:45,rating:4,reviews:12,colors:[{name:"Beige",hex:"#d9c6a5"},{name:"Black",hex:"#1c1d22"}],sizes:["S","M","L"],stock:18,image:px(2854430),gallery:[px(2854430)],tags:["Dress","Casual"],description:"The everyday dress: mid-length, soft drape, side pockets." },
  { id:"p05",name:"Long Sleeve Coat",category:"Jackets",price:89,oldPrice:120,rating:5,reviews:17,brand:"Hugo Boss",colors:[{name:"Tan",hex:"#c8a878"}],sizes:["S","M","L","XL"],stock:7,image:px(24838994),gallery:[px(24838994),px(16192895)],tags:["Jacket","Coat"],description:"A full-length city coat with a clean shoulder." },
  { id:"p06",name:"Black Flap Top",category:"T-Shirts",price:28,oldPrice:45,rating:3,reviews:5,colors:[{name:"Black",hex:"#1c1d22"}],sizes:["S","M","L"],stock:22,image:px(18457838),gallery:[px(18457838)],tags:["T Shirt"],description:"Boxy flap top in a matte black knit." },
  { id:"p07",name:"Checked T-Shirt",category:"T-Shirts",price:19.9,oldPrice:25,rating:4,reviews:9,colors:[{name:"Navy",hex:"#2c3a55"},{name:"Pink",hex:"#e9b8c4"}],sizes:["S","M","L","XL"],stock:26,image:px(19778353),gallery:[px(19778353)],tags:["T Shirt","Flannel"],description:"Classic flannel-check tee in a crisp cotton poplin." },
  { id:"p08",name:"Plaided Singlet",category:"T-Shirts",price:15,oldPrice:17,rating:4,reviews:6,colors:[{name:"Multi",hex:"#d8705a"}],sizes:["S","M","L"],stock:31,image:px(10601236),gallery:[px(10601236)],tags:["Tank"],description:"A light summer singlet with a playful plaid print." },
  { id:"p09",name:"Modern Black Dress",category:"Dresses",price:46,oldPrice:60,rating:5,reviews:14,colors:[{name:"Black",hex:"#1c1d22"}],sizes:["S","M","L","XL"],stock:10,image:px(34921744),gallery:[px(34921744)],tags:["Dress"],description:"An architectural black dress with a sharp neckline." },
  { id:"p10",name:"Suede Black Dress",category:"Dresses",price:50,oldPrice:62,rating:4,reviews:7,colors:[{name:"Black",hex:"#26272c"}],sizes:["S","M","L"],stock:8,image:px(38959988),gallery:[px(38959988)],tags:["Dress"],description:"Nubuck-touch black dress with a soft matte finish." },
  { id:"p11",name:"Blue Bodycon Dress",category:"Dresses",price:42,rating:4,reviews:11,colors:[{name:"Blue",hex:"#3f6fa8"},{name:"Black",hex:"#1c1d22"}],sizes:["S","M","L"],stock:13,image:px(31046837),gallery:[px(31046837)],tags:["Dress"],description:"Second-skin bodycon in a saturated sapphire." },
  { id:"p12",name:"Green Velvet Dress",category:"Dresses",price:38,oldPrice:52,rating:5,reviews:9,colors:[{name:"Green",hex:"#3d7a5a"}],sizes:["S","M","L","XL"],stock:6,image:px(30294790),gallery:[px(30294790)],tags:["Dress"],description:"Velour-drape dress in deep emerald." },
  { id:"p13",name:"Classic Leather Jacket",category:"Jackets",price:120,oldPrice:150,rating:5,reviews:24,brand:"Hugo Boss",colors:[{name:"Black",hex:"#17181c"},{name:"Brown",hex:"#6b4a33"}],sizes:["M","L","XL"],stock:5,image:px(3698843),gallery:[px(3698843)],tags:["Jacket","Leather"],description:"Full-grain leather biker with brushed copper hardware." },
  { id:"p14",name:"Wide Leg Trousers",category:"Pants",price:36,rating:4,reviews:8,colors:[{name:"Grey",hex:"#9a9da4"},{name:"Black",hex:"#1c1d22"}],sizes:["S","M","L","XL"],stock:19,image:px(5112349),gallery:[px(5112349)],tags:["Jeanswear"],description:"High-rise wide legs with a pressed crease." },
  { id:"p15",name:"City Trench Coat",category:"Jackets",price:95,oldPrice:130,rating:4,reviews:13,brand:"Hugo Boss",colors:[{name:"Camel",hex:"#b98d5f"}],sizes:["S","M","L","XL"],stock:9,image:px(16192895),gallery:[px(16192895)],tags:["Jacket","Coat"],description:"The trench, updated with a storm flap and detachable belt." },
  { id:"p16",name:"Pastel Suit Set",category:"Jackets",price:68,oldPrice:85,rating:4,reviews:6,colors:[{name:"Pink",hex:"#e9b8c4"},{name:"Mint",hex:"#bfe3d0"}],sizes:["S","M","L"],stock:7,image:px(18334800),gallery:[px(18334800)],tags:["Suit"],description:"Two-piece pastel set in a matte suiting wool." },
  { id:"p17",name:"Straw Wide Brim Hat",category:"Accessories",price:22,rating:5,reviews:10,colors:[{name:"Straw",hex:"#cbb389"}],sizes:["OS"],stock:16,image:px(11724375),gallery:[px(11724375)],tags:["Hat"],description:"Hand-woven straw with a deep brim and grosgrain band." },
  { id:"p18",name:"Marine Blazer",category:"Jackets",price:74,oldPrice:90,rating:4,reviews:5,colors:[{name:"Navy",hex:"#23334d"}],sizes:["S","M","L","XL"],stock:12,image:px(17542260),gallery:[px(17542260)],tags:["Jacket","Suit"],description:"A nautical blazer with a peaked lapel." }
];

await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fasco");
await Product.deleteMany({});
await Product.insertMany(PRODUCTS);
if (!(await User.findOne({email:"demo@fasco.com"}))) await User.create({firstName:"Demo",lastName:"Shopper",email:"demo@fasco.com",password:await bcrypt.hash("demo123",10)});
console.log(`Seeded ${PRODUCTS.length} products + demo user`);
await mongoose.disconnect();
