import { useState } from "react";
import DetailsEditor from "./DetailsEditor";
import QuestionsEditor from "./Questions/QuestionsEditor";

export default function EditorTabs() {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <div id="wd-details-tabs" className=" w-100 ms-2">
      <ul className="nav nav-tabs mb-2">
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "details" ? "active" : "text-danger"}`}
            data-bs-toggle="tab"
            href="#wd-quiz-details"
            onClick={() => setActiveTab("details")}
          >
            Details
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "questions" ? "active" : "text-danger"}`}
            data-bs-toggle="tab"
            href="#wd-quiz-questions"
            onClick={() => setActiveTab("questions")}
          >
            Questions
          </a>
        </li>
      </ul>
      <div className="tab-content">
        {activeTab === "details" && <DetailsEditor />}
        {activeTab === "questions" && <QuestionsEditor />}
      </div>
    </div>
  );
}