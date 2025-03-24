import { useEffect, useState } from "react";

const ResultsClient = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching data...");
  
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/message");
        console.log("Response status:", response.status);
        
        const result = await response.json();
        console.log("Fetched Data:", result);
        
        setData(result);
      } catch (error) {
        console.error("Fetch error:", error);
        setData({ error: "Failed to fetch data" });
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);



  return (
    <div className="container">
      {data?.error ? (
        <div className="card">❌ <b>Error:</b> {data.error}</div>
      ) : (
        <>
          <div className="card">
            <h2>✅ Skin Analysis</h2>
            <p><b>Real Age:</b> {data?.real_age || "N/A"}</p>
            <p><b>Skin Age:</b> {data?.skin_age || "N/A"}</p>
          </div>

          <div className="card">
            <h2>🌟 Skin Quality Score</h2>
            <p className="text-2xl font-bold">{data?.skin_quality_score || "N/A"}</p>
          </div>

          {data?.insights && Object.keys(data.insights).length > 0 ? (
            <div className="card">
              <h2>💡 Skin Insights</h2>
              {Object.entries(data.insights).map(([key, value]) => (
                <p key={key}><b>{key.replace(/_/g, ' ')}:</b> {value}</p>
              ))}
            </div>
          ) : (
            <div className="card">
              <h2>💡 Skin Insights</h2>
              <p>No insights available.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ResultsClient;
