"use client";
import react, { useState, useEffect } from "react";
import api from "./api/localapi";
import Navbar from "./components/Navbar";
import * as React from "react";
import { Button } from "./components/ui/button";
import "./styles/home.css";
// for api graph, limited use daily
import PieChart from "./components/piechart";
import Graph from "./components/invesgraph";
import IncomeGraph from "./components/incomegraph";
import Emptypiechart from "./components/emptypiechart";
import ProtectedRoute from "./components/ProtectedRoute";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ACCESS_TOKEN } from "./constants";

function Page() {
  const [allowances, setAllowances] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        console.log("Unauthorized request. Silencing error...");
        return Promise.resolve({ data: [] });
      }
      return Promise.reject(error);
    }
  );
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem(ACCESS_TOKEN);

      if (!token) {
        setIsLoggedIn(false); // Set isLoggedIn to false if token is not present
      } else {
        setIsLoggedIn(true);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    getAllowances();
  }, []);

  const getAllowances = () => {
    api
      .get("/api/allowance/")
      .then((res) => {
        const data = res.data;

        // Ensure data is an array
        if (Array.isArray(data)) {
          setAllowances(data);
        } else {
          alert("Error: Data returned is not an array");
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          console.log("You are not logged in!");
        }
      });
  };
  const sortedAllowances = allowances.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
  return (
    <ProtectedRoute>
      <div>
        <div className="first-row">
          <Navbar />
          <br />
          <div className="card">
            {!isLoggedIn ? (
              <Card className="w-[350px] min-h-[280px]">
                <div className="card-content">
                  <CardHeader>
                    <CardTitle>Not yet a FTrack user?</CardTitle>

                    <Button
                      className="button"
                      onClick={() => window.open("/register", "_blank")}
                    >
                      Get started
                    </Button>

                    <br />
                    <CardTitle>Already a FTrack user?</CardTitle>

                    <Button
                      className="button"
                      onClick={() => window.open("/login", "_blank")}
                    >
                      Login now
                    </Button>
                  </CardHeader>
                </div>
              </Card>
            ) : (
              <Card
                className="w-[350px] min-h-[280px] card-logged"
                onClick={() => (window.location.href = "/home")}
              >
                <CardHeader>
                  <CardTitle>Your Allowance</CardTitle>
                  <CardDescription>
                    Keep track of your allowance goals.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {allowances[0] == null ? (
                    <div className="grid w-full items-center gap-4">
                      <h1>Start your financial journey with us!</h1>

                      <Button onClick={() => (window.location.href = "/home")}>
                        Start now
                      </Button>
                    </div>
                  ) : (
                    <div className="grid w-full items-center gap-4">
                      {Array.isArray(sortedAllowances) &&
                        sortedAllowances.slice(0, 1).map((allowance) => (
                          <div key={allowance.id}>
                            <div className="flex flex-col space-y-1.5">
                              <strong>Allowance:</strong>{" "}
                              <span>${allowance.allowance}</span>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                              <strong>Type:</strong>{" "}
                              <span>{allowance.type}</span>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                              <strong>Daily Recommended:</strong>{" "}
                              <span>${allowance.recommended}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
          <Card className="w-[350px] min-h-[280px] max-h-[390px]">
            <CardHeader>
              <CardTitle>Your Income-Expenditure This Month</CardTitle>
              <CardDescription>
                A look into your estimated savings to spendings this month.
              </CardDescription>
              {!isLoggedIn ? (
                <CardContent>
                  <h1>Please Login to view your details!</h1>
                  <Emptypiechart />
                </CardContent>
              ) : (
                <CardContent>
                  <PieChart />
                </CardContent>
              )}
            </CardHeader>
          </Card>
        </div>
        <div className="two-row">
          <Card className="w-[600px] min-h-[280px] income-card">
            <CardTitle>Your Spendings-Savings data</CardTitle>
            <CardDescription>
              A study on your recent trend in Spendings and Savings.
            </CardDescription>

            {!isLoggedIn ? <h1>Please Login to view your details!</h1> : ""}
            <br />
            <IncomeGraph className="income-graph" />
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default Page;

/*
<Card className="w-[500px] min-h-[300px] graph">
        <Graph />
      </Card>
      */
