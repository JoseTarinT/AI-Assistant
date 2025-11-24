import { useState, useEffect, useRef } from "react";
import styles from "./ConfigurePage.module.css";

type TriageRule = {
  conditions: {
    type?: string;
    location?: string;
    department?: string;
  };
  assignee: string;
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export default function ConfigurePage() {
  const [rules, setRules] = useState<TriageRule[]>([]);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showButtons, setShowButtons] = useState<boolean>(false);
  const inputRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // When editingId changes, focus the input for the active row
    if (editingIndex !== null && inputRef.current[editingIndex]) {
      inputRef.current[editingIndex].focus();
    }
  }, [editingIndex]);

  useEffect(() => {
    const fetchConfig = async () => {
      const response = await fetch(`${API_BASE_URL}/api/configure`);
      const data = await response.json();
      setRules(data.rules || []);
    };
    fetchConfig();
  }, []);

  const addRule = () => {
    setRules((prev) => {
      const newRule = { conditions: {}, assignee: "" };
      setEditingIndex(prev.length);
      return [...prev, newRule];
    });
    setShowButtons(true);
  };

  const save = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/configure`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rules),
      });
      if (!response.ok) {
        setToast({ message: "Failed to save rules", type: "error" });
        return;
      }
      setToast({ message: "Rules saved successfully!", type: "success" });
      setShowButtons(false);
      setEditingIndex(null);
    } catch (error) {
      console.error(error);
      setToast({ message: "An error occurred while saving", type: "error" });
    } finally {
      // Auto-dismiss toast after 3 seconds
      setTimeout(() => setToast(null), 3000);
    }
  };

  const editRule = (index: number, field: string, value: string) => {
    const updated = [...rules];
    if (field === "assignee") {
      updated[index].assignee = value;
    } else if (field === "type" || field === "location") {
      updated[index].conditions[field] = value;
    }
    setRules(updated);
  };

  const enableEditing = (
    index: number,
    e?: React.MouseEvent<HTMLButtonElement>
  ) => {
    e?.currentTarget?.blur();
    setEditingIndex(index);
    setShowButtons(true);
  };

  const disableEditing = () => {
    if (editingIndex !== null) {
      const rule = rules[editingIndex];
      const isEmptyConditions =
        !rule.conditions ||
        Object.values(rule.conditions).every(
          (v) => v === undefined || v === null || String(v).trim() === ""
        );
      const isEmptyAssignee = !rule.assignee || rule.assignee.trim() === "";

      if (isEmptyAssignee && isEmptyConditions) {
        setRules((prev) => prev.filter((_, i) => i !== editingIndex));
      }
    }
    setEditingIndex(null);
    setShowButtons(false);
  };

  const deleteRule = async (index: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/configure`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rules.filter((_, i) => i !== index)),
      });
      setRules(rules.filter((_, i) => i !== index));
      setToast({ message: "Rule deleted successfully!", type: "success" });
    } catch (error) {
      console.error(error);
      setToast({ message: "An error occurred while saving", type: "error" });
    } finally {
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className={styles.configurePage}>
      <h1>Triage Rule Configuration</h1>
      <div>
        <button className={styles.addRuleButton} onClick={addRule}>
          Add Rule
        </button>

        {rules.length > 0 ? (
          <table className={styles.rulesTable}>
            <thead>
              <tr>
                <th>Type</th>
                <th>Location</th>
                <th>Assignee Email</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule, i) => (
                <tr key={i}>
                  <td>
                    <input
                      ref={(el) => {
                        if (inputRef.current) {
                          inputRef.current[i] = el;
                        }
                      }}
                      value={rule.conditions.type || ""}
                      onChange={(e) => editRule(i, "type", e.target.value)}
                      disabled={editingIndex !== i}
                      placeholder="Enter type"
                      type="text"
                    />
                  </td>
                  <td>
                    <input
                      ref={(el) => {
                        if (inputRef.current) {
                          inputRef.current[i] = el;
                        }
                      }}
                      value={rule.conditions.location || ""}
                      onChange={(e) => editRule(i, "location", e.target.value)}
                      disabled={editingIndex !== i}
                      placeholder="Enter location"
                      type="text"
                    />
                  </td>
                  <td>
                    <input
                      ref={(el) => {
                        if (inputRef.current) {
                          inputRef.current[i] = el;
                        }
                      }}
                      value={rule.assignee}
                      onChange={(e) => editRule(i, "assignee", e.target.value)}
                      disabled={editingIndex !== i}
                      placeholder="user@example.com"
                      type="email"
                      required
                    />
                  </td>
                  <td>
                    <button
                      className={`${styles.editRuleButton} ${
                        editingIndex === i ? styles.active : ""
                      }`}
                      onClick={(e) => enableEditing(i, e)}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      className={styles.deleteRuleButton}
                      onClick={() => deleteRule(i)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ marginTop: "1rem", color: "#666" }}>
            No rules configured yet. Click "Add Rule" to get started.
          </p>
        )}
        {showButtons && (
          <button className={styles.saveRuleButton} onClick={save}>
            Save Rules
          </button>
        )}
        {editingIndex !== null && (
          <button
            className={styles.cancelEditingButton}
            onClick={disableEditing}
          >
            Cancel
          </button>
        )}
      </div>
      {toast && (
        <div className={`${styles.toast} ${styles[`toast-${toast.type}`]}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
