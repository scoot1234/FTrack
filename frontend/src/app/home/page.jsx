"use client";
import { useState, useEffect } from "react";
import api from "../api/localapi";
import ProtectedRoute from "../components/ProtectedRoute";
import "../styles/allowance.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Navbar from "../components/Navbar";
import "../styles/questions.css";

function Home() {
  const [allowances, setAllowances] = useState([]); // initialize as an empty array
  const [allowanceAmount, setAllowanceAmount] = useState(""); // store the allowance amount as a single value
  const [recommended, setRecommended] = useState("");
  const [type, setType] = useState("");
  const [test, setTest] = useState("");
  const [necessities, setNecessities] = useState("");
  const [financial, setFinancial] = useState("");
  const [others, setOthers] = useState("");
  const [networth, setNetworth] = useState("");
  let create_checkYear = 0;
  let create_checkMonth = 0;
  const handleNecessityChange = (value) => {
    setNecessities(value);
  };

  const handleOthersChange = (value) => {
    setOthers(value);
  };

  const handleNetworthAmountChange = (value) => {
    setNetworth(value);
  };

  const handleFinancialChange = (value) => {
    setFinancial(value);
    setRecommended((value / 365).toFixed(2));
  };

  const avgMonthSpend = parseFloat(others) + parseFloat(necessities * 30);
  let updateid = 0;
  if (allowances.length > 0 && allowances[0].id) {
    updateid = allowances[0].id;
  }

  function Delete({ allowance }) {
    return (
      <div className="note-container">
        <button
          className="delete-button"
          onClick={() => deleteAllowance(allowance.id)}
        >
          Delete
        </button>
      </div>
    );
  }

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
          console.log(data);
        } else {
          alert("Error: Data returned is not an array");
        }
      })
      .catch((error) => alert(error));
  };

  const deleteAllowance = (id) => {
    api
      .delete(`/api/allowance/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) alert("Allowance deleted!");
        else alert("Failed to delete allowance");
        getAllowances();
      })
      .catch((error) => alert(error));
  };

  /*const updateAllowance = (id, updatedAllowanceData) => {
    console.log("Updating allowance with ID:", id);
    api
      .put(`/api/allowance/update/${id}/`, updatedAllowanceData)
      // Use PUT request for updating the resource
      .then((res) => {
        if (res.status === 200) {
          alert("Allowance updated!");
          getAllowances(); // Reload the allowances after update
        } else {
          alert("Failed to update allowance");
        }
      })
      .catch((error) => alert(error));
  };*/

  const createAllowance = (e) => {
    e.preventDefault();
    const newAllowance = {
      allowance: allowanceAmount,
      type: type,
      recommended: recommended,
      networth: networth,
      monthlyspent: avgMonthSpend,
    };

    if (
      create_checkYear == create_authYear &&
      create_checkMonth == create_authMonth
    ) {
      alert(
        "You have hit your monthly quota for creating new inputs. You can delete your input and resubmit it."
      );
      //updateAllowance(create_date.id, newAllowance);
    } else {
      api
        .post("/api/allowance/", newAllowance)
        .then((res) => {
          if (res.status === 201) {
            alert("Allowance created!");
            // Prepend the new allowance to the state
            setAllowances([res.data, ...allowances]);
            setAllowanceAmount(""); // Clear the input field after submission
          } else {
            alert("Failed to create allowance");
          }
        })
        .catch((err) => alert(err));
    }
  };

  // Sort allowances by created_at in descending order
  const sortedAllowances = allowances.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
  const create_date = sortedAllowances.length > 0 ? sortedAllowances[0] : null;
  if (create_date) {
    const create_datecheck = new Date(create_date.created_at);
    create_checkYear = `${create_datecheck.getFullYear()}`;
    create_checkMonth = `${String(create_datecheck.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  } else {
    console.log("No recent allowance found.");
  }
  const create_auth = new Date(Date.now());
  const create_authYear = create_auth.getFullYear();
  const create_authMonth = parseInt(
    String(create_auth.getMonth() + 1).padStart(2, "0")
  );

  return (
    <ProtectedRoute>
      <Navbar />
      <br />
      <form onSubmit={createAllowance} className="questions">
        <div className="form-container">
          <div className="input-container">
            <label htmlFor="allowance">Allowance/Income:</label>
            <input
              className="no-arrows"
              type="number"
              id="allowance"
              name="allowance"
              required
              onChange={(e) => setAllowanceAmount(e.target.value)}
              value={allowanceAmount}
            />
            <br />
          </div>

          <div className="input-container">
            <label htmlFor="allowancetype">Allowance/Income Type:</label>
            <select
              id="type"
              name="type"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
              }}
              required
            >
              <option value="" disabled>
                Select Allowance/Income Type
              </option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
            <br />
          </div>

          <div className="input-container">
            <label htmlFor="networth">
              What is your financial net worth (cash) from all sources (bank
              account, investments)?
            </label>

            <input
              type="number"
              placeholder="$30"
              value={networth}
              onChange={(e) => handleNetworthAmountChange(e.target.value)}
            />
            <br />
          </div>
          <div className="input-container">
            <label htmlFor="necessities">
              How much do you spend on necessities daily (eg. food, water,
              transport, etc.)
            </label>

            <input
              type="number"
              placeholder="$30"
              value={necessities}
              onChange={(e) => handleNecessityChange(e.target.value)}
            />
            <br />
          </div>

          <div className="input-container">
            <label htmlFor="Others">
              How much will you be spending on other products this month?
            </label>

            <input
              type="number"
              placeholder="$30"
              value={others}
              onChange={(e) => handleOthersChange(e.target.value)}
              required
            />
            <br />
          </div>

          <div className="input-container">
            <label htmlFor="financial">
              Do you have a financial goal that you want to achieve by the end
              of the year through saving your allowance?
            </label>
            <input
              type="number"
              placeholder="$30"
              value={financial}
              onChange={(e) => handleFinancialChange(e.target.value)}
            />
            <br />
          </div>
          <br />
          <input type="submit" value="Submit" className="submit-button" />
        </div>
      </form>

      <br />

      {allowances[0] != null && (
        <Table className="table-container">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px] h-[50px]">S/N</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Daily Recommanded</TableHead>
              <TableHead>Monthly Expenditure</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Net Worth</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(sortedAllowances) &&
              sortedAllowances.map((allowance, index) => (
                <TableRow key={allowance.id}>
                  <TableCell className="font-medium ">{index + 1}</TableCell>
                  <TableCell>${allowance.allowance}</TableCell>
                  <TableCell>{allowance.type}</TableCell>
                  <TableCell>${allowance.recommended}</TableCell>
                  <TableCell>${allowance.monthlyspent}</TableCell>
                  <TableCell>
                    {new Date(allowance.created_at).toLocaleString("en-US", {
                      weekday: "short", // Optional: includes weekday
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>${allowance.networth}</TableCell>
                  <TableCell>
                    <Delete allowance={allowance} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </ProtectedRoute>
  );
}

export default Home;

/*create a list of questions to find out users daily lifestyle and use it to calculate


financial Goal
daily necessities after deduction
amount daily
daily savings = amount - daily
recommended = financial/365

necessities
total

*/
