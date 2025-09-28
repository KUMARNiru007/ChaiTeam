import React from "react";
import { Link } from "react-router-dom";
import ChaiCodeImage from "../assets/chaicode-black.svg";

const Features = () => {
  return (
    <div className="w-full h-full text-black bg-white flex flex-col items-center py-15">
      <span className="parkinsans-Regular text-5xl">Features</span>
      <span className="mt-6">
        Conatins all essential features that you need.
      </span>

      <div className="mt-16 max-w-4xl">
        <div className="grid rounded-lg md:grid-cols-3">
          {/* 1st Box */}
          <div className="flex flex-col relative overflow-hidden h-auto text-foreground box-border min-w-68 rounded-none rounded-tl-lg border-1 border-slate-300 px-4 py-6 hover:bg-[#ff9335]/10 hover:border-[#ff9335]/20 transition-all duration-200">
            <div className="flex p-3 w-full justify-start items-center shrink-0 overflow-inherit subpixel-antialiased rounded-t-lg">
              <div className="relative max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap h-7 text-small bg-blue-200 text-blue-600 rounded-md p-0">
                <span className="flex-1 text-inherit font-normal px-2">
                  Collobrative
                </span>
              </div>
            </div>

            <div className="relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased text-black">
              <p className="text-lg font-medium !text-black/60">
                Create or join Teams of your batches, compete with other teams
                and build network.
              </p>
            </div>
          </div>

          {/* 2nd Box */}
          <div className="flex flex-col relative overflow-hidden h-auto text-foreground box-border min-w-68 rounded-none border-1 border-slate-300 px-4 py-6 hover:bg-[#ff9335]/10 hover:border-[#ff9335]/20 transition-all duration-200">
            <div className="flex p-3 w-full justify-start items-center shrink-0 overflow-inherit subpixel-antialiased rounded-t-lg">
              <div className="relative max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap h-7 text-small bg-purple-200 text-purple-600 rounded-md p-0">
                <span className="flex-1 text-inherit font-normal px-2">
                  Focused Work
                </span>
              </div>
            </div>

            <div className="relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased text-black">
              <p className="text-lg font-medium !text-black/60">
                Team members focus on a single task at a time, reducing
                distractions and increasing productivity.
              </p>
            </div>
          </div>

          {/* 3rd Box */}
          <div className="flex flex-col relative overflow-hidden h-auto text-foreground box-border min-w-68 rounded-none rounded-tr-lg border-1 border-slate-300 px-4 py-6 hover:bg-[#ff9335]/10 hover:border-[#ff9335]/20 transition-all duration-200">
            <div className="flex p-3 w-full justify-start items-center shrink-0 overflow-inherit subpixel-antialiased rounded-t-lg">
              <div className="relative max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap h-7 text-small bg-lime-200 text-lime-600 rounded-md p-0">
                <span className="flex-1 text-inherit font-normal px-2">
                  LeaderShip Skills
                </span>
              </div>
            </div>

            <div className="relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased text-black">
              <p className="text-lg font-medium !text-black/60">
                Enhnace the Leadership and managment skills by leading a Team
                which build job-ready skills.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4">
          {/* 1st Box */}
          <div className="flex flex-col relative overflow-hidden h-auto text-foreground box-border min-w-52 rounded-none border-1 border-slate-300 px-4 py-6 hover:bg-[#ff9335]/10 hover:border-[#ff9335]/20 transition-all duration-200">
            <div className="flex p-3 w-full justify-start items-center shrink-0 overflow-inherit subpixel-antialiased rounded-t-lg">
              <div className="relative max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap h-7 text-small bg-gray-200 text-gray-600 rounded-md p-0">
                <span className="flex-1 text-inherit font-normal px-2">
                  Peer Reviews
                </span>
              </div>
            </div>

            <div className="relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased text-black">
              <p className="text-lg font-medium !text-black/60">
                Give and recieve contructive feedback and learn by
                colloboration.
              </p>
            </div>
          </div>

          {/* 2nd Box */}
          <div className="flex flex-col relative overflow-hidden h-auto text-foreground box-border min-w-52 rounded-none border-1 border-slate-300 px-4 py-6 hover:bg-[#ff9335]/10 hover:border-[#ff9335]/20 transition-all duration-200">
            <div className="flex p-3 w-full justify-start items-center shrink-0 overflow-inherit subpixel-antialiased rounded-t-lg">
              <div className="relative max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap h-7 text-small bg-blue-200 text-blue-600 rounded-md p-0">
                <span className="flex-1 text-inherit font-normal px-2">
                  Join Request
                </span>
              </div>
            </div>

            <div className="relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased text-black">
              <p className="text-lg font-medium !text-black/60">
                Request multiple teams to join with transparent application
                tracking.
              </p>
            </div>
          </div>

          {/* 3rd Box */}
          <div className="flex flex-col relative overflow-hidden h-auto text-foreground box-border min-w-52 rounded-none border-1 border-slate-300 px-4 py-6 hover:bg-[#ff9335]/10 hover:border-[#ff9335]/20 transition-all duration-200">
            <div className="flex p-3 w-full justify-start items-center shrink-0 overflow-inherit subpixel-antialiased rounded-t-lg">
              <div className="relative max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap h-7 text-small bg-orange-200 text-orange-600 rounded-md p-0">
                <span className="flex-1 text-inherit font-normal px-2">
                  Managment
                </span>
              </div>
            </div>

            <div className="relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased text-black">
              <p className="text-lg font-medium !text-black/60">
                Leader review application and add mamber base on skills and
                requirments.
              </p>
            </div>
          </div>

          {/* 4th Box */}
          <div className="flex flex-col relative overflow-hidden h-auto text-foreground box-border min-w-52 rounded-none border-1 border-slate-300 px-4 py-6 hover:bg-[#ff9335]/10 hover:border-[#ff9335]/20 transition-all duration-200">
            <div className="flex p-3 w-full justify-start items-center shrink-0 overflow-inherit subpixel-antialiased rounded-t-lg">
              <div className="relative max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap h-7 text-small bg-purple-200 text-purple-600 rounded-md p-0">
                <span className="flex-1 text-inherit font-normal px-2">
                  Activity Histroy
                </span>
              </div>
            </div>

            <div className="relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased text-black">
              <p className="text-lg font-medium !text-black/60">
                All Users and Teams activity stored for future word and
                colloboration.
              </p>
            </div>
          </div>

          {/* 5th Box */}
          <div className="flex flex-col relative overflow-hidden h-auto text-foreground box-border col-span-2 min-w-60 rounded-none rounded-bl-lg border-1 border-slate-300 px-4 py-6 hover:bg-[#ff9335]/10 hover:border-[#ff9335]/20 transition-all duration-200">
            <div className="flex p-3 w-full justify-start items-center shrink-0 overflow-inherit subpixel-antialiased rounded-t-lg">
              <div className="relative max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap h-7 text-small bg-red-200 text-red-600 rounded-md p-0">
                <span className="flex-1 text-inherit font-normal px-2">
                  Proof of work
                </span>
              </div>
            </div>

            <div className="relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased text-black">
              <p className="text-lg font-medium !text-black/60">
                Everything you create builds a public portfolio you can proudly
                share with others.
              </p>
            </div>
          </div>

          {/* 6th Box */}
          <div className="flex flex-col relative overflow-hidden h-auto text-foreground box-border col-span-2 min-w-60 rounded-none rounded-br-lg border-1 border-slate-300 px-4 py-6 hover:bg-[#ff9335]/10 hover:border-[#ff9335]/20 transition-all duration-200">
            <div className="flex p-3 w-full justify-start items-center shrink-0 overflow-inherit subpixel-antialiased rounded-tr-lg">
              <div className="relative max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap h-7 text-small bg-green-200 text-green-600 rounded-md p-0">
                <span className="flex-1 text-inherit font-normal px-2">
                  Recommendation
                </span>
              </div>
            </div>

            <div className="relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased text-black">
              <p className="text-lg font-medium !text-black/60">
                Work hard and get recommended by your Batch Teachers and stand
                out from corwd.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mt-20">
        <span className="text-xl">Developed and Maintained For</span>
        <a href="https://www.chaicode.com/" target="_blank">
          <div className="w-64 h-auto mt-2 cursor-pointer">
            <img
              src={ChaiCodeImage}
              alt="Chai code Image"
              className="object-cover"
            />
          </div>
        </a>
      </div>
    </div>
  );
};

export default Features;
