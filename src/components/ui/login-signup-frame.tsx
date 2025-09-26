"use client";
import { FC } from "react";
import Login from "../login";
import SignUp from "../signup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

interface LoginSignupFrameProps {
  session?: Session | null;
}

const LoginSignupFrame: FC<LoginSignupFrameProps> = ({ session }) => {
  if (session) {
    return (
      <Button
        onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
        className="mr-2"
        variant={"outline"}
        size={"sm"}
        
      >
        Logout
      </Button>
    );
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size={"sm"} className="mr-2">
            Login / Signup
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <Tabs defaultValue="account">
            <DialogHeader>
              <DialogTitle>
                <TabsList>
                  <TabsTrigger value="account">Login</TabsTrigger>
                  <TabsTrigger value="password">Signup</TabsTrigger>
                </TabsList>
              </DialogTitle>
            </DialogHeader>
            <TabsContent value="account">
              <Login />
            </TabsContent>
            <TabsContent value="password">
              <SignUp />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginSignupFrame;
