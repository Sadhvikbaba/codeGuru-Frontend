import React, { useState, useEffect , useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select";
import MonacoEditor from "@/components/MonacoEditor";
import { FiSun, FiMoon } from "react-icons/fi";
import { getQuestionById, SubmitCode } from "@/connecting";
import { useParams } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";


const languageIds = {
  cpp: 54,
  c: 50,
  python: 71,
  java: 62,
};

const QuestionPage = () => {
  const lastTestCase = useRef()
  const { slug } = useParams();
  const {toast} = useToast()
  const [code, setCode] = useState("// Write your code here");
  const [activeTab, setActiveTab] = useState("description");
  const [theme, setTheme] = useState("vs-dark");
  const [language, setLanguage] = useState("cpp");
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [testCases, setTestCases] = useState(null);
  const [text, setText] = useState("Run Code / Submit");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await getQuestionById(slug);
        setQuestion(res.question);
        setSubmissions(res.submissions || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch question details:", error);
      }
    };
    fetchDetails();
  }, [slug]);

  useEffect(()=>{
    setTimeout(()=>{lastTestCase.current?.scrollIntoView({behavior : "smooth"})},100);
  } ,[testCases])

  const toggleTheme = () => {
    setTheme(theme === "vs-dark" ? "hc-light" : "vs-dark");
  };

  const handleRunCode = async () => {
    setText("Compiling...")
    await SubmitCode(slug , {source_code : code ,language_id : languageIds[language]})
    .then((res)=>{console.log(res);
      console.log(res);
      
      setTestCases(res)
      setText("Run Code / Submit")
      if(res.totalTestCases == res.passedTestCases){
        toast({description : "Congratulations"})
      }else {
        toast({variant : "destructive" , description : "Uh Oh! There might be errors check it once!!"})
      }
    })
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-6 pt-6 space-y-6 w-full">
      <div className="flex flex-row gap-6">
        <div className="w-1/2 space-y-6">
          <header className="space-y-2">
            <h1 className="text-2xl font-bold">{question.title}</h1>
            <div className="flex items-center gap-4">
              <Badge className="cursor-pointer">{question.difficulty}</Badge>
              <span className="text-sm text-gray-500 cursor-pointer">By {question.author[0].fullName}</span>
            </div>
            <Separator />
          </header>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
            </TabsList>

            <TabsContent value="description">
              <div className="space-y-4 overflow-y-auto max-h-[30rem] scrollMe">
                <h2 className="font-semibold">problem :</h2>
                <p>{question.description}</p>
                <h2 className="font-semibold">Constraints :</h2>
                <pre>{question.constraints}</pre>

                <h2 className="font-semibold">Examples :</h2>
                <ul className="space-y-3 pr-2">
                  {question.examples.map((example, index) => (
                    <li key={index} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <p>
                        <strong>Input:</strong> {example.input}
                      </p>
                      <p>
                        <strong>Output:</strong> {example.output}
                      </p>
                      {example.explanation && (
                        <p>
                          <strong>Explanation:</strong> {example.explanation}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
                <div>
                  <strong>Hints :</strong>
                  {question?.hints?.map((hint, index) => (
                    <p key={index}>{hint}</p>
                  ))}
                </div>
                <div className="p-2">
                  {question?.hints?.map((hint, index) =>
                  <Accordion type="single" collapsible key={index}>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>{"Hint "}{index}</AccordionTrigger>
                      <AccordionContent>
                        {hint}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  )}
                </div>
                <div> If you are geting <strong>Request failed with status code 429</strong> as output sorry to inform that our API rate limit has been completed come tomorrow for submission</div>
              </div>
            </TabsContent>

            <TabsContent value="submissions">
              <div className="space-y-4 overflow-y-auto max-h-[30rem] scrollMe">
                <h2 className="font-semibold"> Submissions</h2>
                  {!Boolean(submissions.length) &&<div className="text-2xl">be first to submit</div>}
                <ul className="space-y-2">
                  {submissions.map((submission, index) => (
                    <li key={index} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <p className="cursor-pointer">
                        <strong>User:</strong> {submission?.user?.fullName}
                      </p>
                      <p>
                        <strong>Language:</strong> {Object.keys(languageIds).find(key => languageIds[key] == submission.language)}
                      </p>
                      <p>
                        <strong>Submitted At:</strong> {new Date(submission.updatedAt).toLocaleString()}
                      </p>
                      <pre className="bg-gray-200 dark:bg-gray-700 p-2 rounded-lg overflow-x-auto scrollMe">
                        {submission.code}
                      </pre>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-1/2 flex flex-col space-y-4 overflow-y-auto scrollMe max-h-[39rem]">
          <form>
            <div className="flex space-x-3 mb-2">
              <Select onValueChange={(e) => setLanguage(e)} value={language}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(languageIds).map(lang => (
                    <SelectItem key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon" type="button" onClick={() => toggleTheme()}>
                {theme === "vs-dark" ? <FiSun /> : <FiMoon />}
              </Button>
            </div>

            <MonacoEditor
              value={code}
              language={language}
              theme={theme}
              onChange={(newValue) => setCode(newValue)}
            />

            <Button className="w-full mt-4" type="button" onClick={()=>handleRunCode()}>
              {text}
            </Button>
            <div className="space-y-2 mt-2 mb-3">
              {testCases && testCases?.results?.map((testcase , index) =>
              <div key={index} ref={lastTestCase}>
                <Testcase value={testcase}  index={index} />
              </div>
                 )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;


function Testcase({ value , index}) {
  const { actualOutput, expectedOutput , passed , input} = value;


  return (
    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Test Case {index + 1}</h3>
        <Badge className={passed ? "bg-green-500 text-white cursor-pointer" : "bg-red-500 text-white cursor-pointer"}>
          {passed ? "Passed" : "Failed"}
        </Badge>
      </div>
      <div>
        <p>
          <strong>Input:</strong> 
          <div className="scrollMe bg-gray-200 dark:bg-gray-700 p-2 rounded-md my-1">
            {input || "N/A"}
          </div>
        </p>
        <p>
          <strong>Output:</strong>
          <div className="scrollMe bg-gray-200 dark:bg-gray-700 p-2 rounded-md my-1">
            {actualOutput || "N/A"}
          </div>
        </p>
        <p>
          <strong>Expected Output:</strong> 
          <div className="scrollMe bg-gray-200 dark:bg-gray-700 p-2 rounded-md my-1">
            {expectedOutput || "N/A"}
          </div>
        </p>
      </div>
      {!passed ? (
        <p className="text-red-500">
          <strong>Verdict:</strong> Outputs do not match.
        </p>
      ) : (
        <p className="text-green-500">
          <strong>Verdict:</strong> Outputs matched.
        </p>
      )}
    </div>
  );
}