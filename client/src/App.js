import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [rules, setRules] = useState([]);
  const [newRule, setNewRule] = useState("");
  const [selectedRules, setSelectedRules] = useState([]);
  const [evaluationData, setEvaluationData] = useState("");
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [modifyRuleId, setModifyRuleId] = useState("");
  const [modifiedRule, setModifiedRule] = useState("");
  const [selectedRuleId, setSelectedRuleId] = useState("");

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await axios.get("/get_rules");
      setRules(response.data);
    } catch (error) {
      console.error("Error fetching rules:", error);
    }
  };

  const createRule = async () => {
    if (!newRule) {
      alert("Please enter a rule string.");
      return;
    }
    try {
      const response = await axios.post("/create_rule", {
        rule_string: newRule,
      });
      console.log("Rule created:", response.data);
      setNewRule("");
      fetchRules();
    } catch (error) {
      console.error("Error creating rule:", error);
    }
  };

  const combineRules = async () => {
    if (selectedRules.length < 2) {
      alert("Please select at least two rules to combine.");
      return;
    }
    try {
      const response = await axios.post("/combine_rules", {
        rule_ids: selectedRules,
      });
      console.log("Rules combined:", response.data);
      setSelectedRules([]);
      fetchRules();
    } catch (error) {
      console.error("Error combining rules:", error);
    }
  };

  const evaluateRule = async (ruleId) => {
    if (!ruleId) {
      alert("Please select a rule to evaluate.");
      return;
    }
    if (!evaluationData) {
      alert("Please enter JSON data for evaluation.");
      return;
    }
    try {
      const response = await axios.post("/evaluate_rule", {
        rule_id: ruleId,
        data: JSON.parse(evaluationData),
      });
      setEvaluationResult(response.data.result);
    } catch (error) {
      console.error("Error evaluating rule:", error);
    }
  };

  const modifyRule = async () => {
    if (!modifyRuleId || !modifiedRule) {
      alert("Please enter both rule ID and new rule string.");
      return;
    }
    try {
      const response = await axios.post("/modify_rule", {
        rule_id: modifyRuleId,
        new_rule_string: modifiedRule,
      });
      console.log("Rule modified:", response.data);
      setModifyRuleId("");
      setModifiedRule("");
      fetchRules();
    } catch (error) {
      console.error("Error modifying rule:", error);
    }
  };

  return (
    <div className="App">
      <h1>Rule Management System</h1>

      <h2>Create Rule</h2>
      <input
        type="text"
        value={newRule}
        onChange={(e) => setNewRule(e.target.value)}
        placeholder="Enter rule string"
      />
      <button onClick={createRule}>Create Rule</button>

      <h2>Existing Rules</h2>
      <div className="scrollable-list">
        <ul>
          {rules.map((rule) => (
            <li key={rule.id}>
              {rule.rule_string}
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  checked={selectedRules.includes(rule.id)}
                  onChange={() => {
                    if (selectedRules.includes(rule.id)) {
                      setSelectedRules(
                        selectedRules.filter((id) => id !== rule.id)
                      );
                    } else {
                      setSelectedRules([...selectedRules, rule.id]);
                    }
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={combineRules} disabled={selectedRules.length < 2}>
        Combine Selected Rules
      </button>

      <h2>Evaluate Rule</h2>
      <div className="dropdown">
        <button className="dropdown-toggle">
          {selectedRuleId
            ? rules.find((rule) => rule.id === selectedRuleId)?.rule_string ||
              "Select a rule"
            : "Select a rule"}
        </button>
        <div className="dropdown-menu">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="dropdown-item"
              onClick={() => {
                setSelectedRuleId(rule.id);
                setEvaluationResult(null);
              }}
            >
              {rule.rule_string}
            </div>
          ))}
        </div>
      </div>
      <textarea
        value={evaluationData}
        onChange={(e) => setEvaluationData(e.target.value)}
        placeholder="Enter JSON data for evaluation"
      />
      <button onClick={() => evaluateRule(selectedRuleId)}>Evaluate</button>
      {evaluationResult !== null && (
        <p>Evaluation Result: {evaluationResult.toString()}</p>
      )}

      <h2>Modify Rule</h2>
      <input
        type="text"
        value={modifyRuleId}
        onChange={(e) => setModifyRuleId(e.target.value)}
        placeholder="Enter rule ID to modify"
      />
      <input
        type="text"
        value={modifiedRule}
        onChange={(e) => setModifiedRule(e.target.value)}
        placeholder="Enter new rule string"
      />
      <button onClick={modifyRule}>Modify Rule</button>
    </div>
  );
}

export default App;
