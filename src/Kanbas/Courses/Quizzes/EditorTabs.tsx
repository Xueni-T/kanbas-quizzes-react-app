import { useState } from "react";
import DetailsEditor from "./DetailsEditor";
import QuestionsEditor from "./Questions/QuestionsEditor";

export default function EditorTabs() {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <div id="wd-editor-tabs" className="w-100 ms-2">
      <ul className="nav nav-tabs mb-3">
        {["details", "questions"].map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${activeTab === tab ? "active" : "text-danger"}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </li>
        ))}
      </ul>
      <div className="tab-content p-3">
        {activeTab === "details" && <DetailsEditor />}
        {activeTab === "questions" && <QuestionsEditor />}
      </div>
    </div>
  );
}