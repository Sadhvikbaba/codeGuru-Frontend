import { Button } from "@/components/ui/button"; 
import homepage from "@/assets/homepage_img.jpeg";
import { useNavigate } from "react-router-dom";
import homepage_img2 from "@/assets/homepage_img2.jpeg"
import {TbTargetArrow} from "react-icons/tb";
import { FaUser } from "react-icons/fa";
import {AiOutlineFileDone} from "react-icons/ai";
import { useEffect , useState} from "react";
import {getCounts} from "@/connecting/index"
import Logo from "@/assets/logo.png";

const HomePage = () => {
  const [counts , setCounts] = useState(null)
  const [loading , setLoading] = useState(true)
  const Navigate = useNavigate()
  useEffect(() => {
    const fetchDetails = async ()=>{
      await getCounts()
      .then((res) => {setCounts(res)
        setLoading(false)
      })
      .catch((res)=>console.log(res))
    }

    fetchDetails()
  } , [])
  if(! loading) return (
    <>
    <div className="min-h-[34rem] flex flex-col bg-cover bg-center" style={{ backgroundImage:`url(${homepage})` }}>
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-transparent">
        <div className="text-2xl font-bold text-white flex items-center"><img src={Logo} alt=""  className="w-16 h-9"/> Code Guru</div>
        
        <Button variant="outline" className="rounded-3xl bg-transparent border-white text-white hover:bg-white hover:text-black" onClick={()=>Navigate("/login")}>Get Started</Button>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center text-center p-6 text-white">
        <h1 className="text-5xl font-bold mb-4">
          Level Up Your Coding Skills
        </h1>
        <p className="text-lg max-w-2xl mb-6">
          The ultimate platform for developers to solve real-world problems, master DSA, and ace coding interviews.
        </p>
        <div className="flex gap-4">
          <Button variant="default" onClick={()=> Navigate("/login")}>
            Get Started
          </Button>
          <Button variant="secondary" >
            Learn More
          </Button>
        </div>
      </main>

    </div>
      {/* aboutSection */}
      <main className="p-10 flex items-center">
        <div >
        <h1 className="text-2xl font-bold uppercase mb-4">About Us &nbsp; <hr /></h1>
          <div className="flex">
            <img src={homepage_img2} alt="img" className="w-[20rem] h-[20rem] mr-4 rounded-xl"/>
            <div className="flex flex-col">
              <div className=" mx-auto text-center mb-12">
                <p className="text-2xl font-light leading-relaxed">
                  We combine creative designs, innovative challenges, and a deep understanding of the developer community to 
                  help programmers master coding skills. With years of experience and a passion for innovation, we deliver platforms 
                  that matter—whether it’s solving real-world problems, building a strong community, or boosting your coding expertise.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <div className="dark:bg-gray-700 bg-gray-200 rounded-lg shadow-md p-6 text-center">
                  <h3 className="text-6xl font-bold flex justify-center w-full"><TbTargetArrow/></h3>
                  <h3 className="text-2xl font-bold">{counts.questions} +</h3>
                  <p className="text-lg  mt-2">Problems</p>
                </div>

                <div className="dark:bg-gray-700 bg-gray-200 rounded-lg shadow-md p-6 text-center">
                <h3 className="text-6xl font-bold flex justify-center w-full"><FaUser/></h3>
                  <h3 className="text-2xl font-bold">{counts.users} +</h3>
                  <p className="text-lg  mt-2">Coders Engaged</p>
                </div>

                <div className="dark:bg-gray-700 bg-gray-200 rounded-lg shadow-md p-6 text-center">
                  <div className="text-6xl font-bold flex justify-center w-full"><AiOutlineFileDone/></div>
                  <h3 className="text-2xl font-bold">{counts.submissions} +</h3>
                  <p className="text-lg  mt-2">accepted Submissons</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <main>
        
      </main>
    </>
  );
};

export default HomePage;

