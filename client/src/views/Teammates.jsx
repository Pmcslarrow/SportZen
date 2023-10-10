import React, { useEffect, useState } from 'react';
import './teammates.css'

const Teammates = ({ surveyList, currentUserEmail }) => {
  const [aggregatedData, setAggregatedData] = useState([]);

  useEffect(() => {
    if (!surveyList) {
      return;
    }

    // Create an object to store aggregated data
    const aggregatedDataMap = {};

    // Loop through the surveyList to aggregate data
    surveyList.forEach((survey) => {
      const { email, physicalHealth, mentalHealth, stressLevel, performanceRating } = survey;

      // Exclude the user's email
      if (email === currentUserEmail) {
        return;
      }

      // If the email doesn't exist in the aggregatedDataMap, initialize it
      if (!aggregatedDataMap[email]) {
        aggregatedDataMap[email] = {
          email,
          totalPhysicalHealth: 0,
          totalMentalHealth: 0,
          totalStressLevel: 0,
          totalPerformanceRating: 0,
          count: 0,
        };
      }

      // Update the totals and count
      aggregatedDataMap[email].totalPhysicalHealth += physicalHealth;
      aggregatedDataMap[email].totalMentalHealth += mentalHealth;
      aggregatedDataMap[email].totalStressLevel += stressLevel;
      aggregatedDataMap[email].totalPerformanceRating += performanceRating;
      aggregatedDataMap[email].count += 1;
    });

    // Calculate averages and convert to an array
    const aggregatedDataArray = Object.values(aggregatedDataMap).map((item) => ({
      email: item.email,
      averagePhysicalHealth: item.totalPhysicalHealth / item.count,
      averageMentalHealth: item.totalMentalHealth / item.count,
      averageStressLevel: item.totalStressLevel / item.count,
      averagePerformanceRating: item.totalPerformanceRating / item.count,
    }));

    // Set the aggregated data in state
    setAggregatedData(aggregatedDataArray);
  }, [surveyList, currentUserEmail]);

  return (
    <div className='table-container'>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Avg Physical Health</th>
            <th>Avg Mental Health</th>
            <th>Avg Stress Level</th>
            <th>Avg Performance Rating</th>
          </tr>
        </thead>
        <tbody>
          {aggregatedData.map((item) => (
            <tr key={item.email}>
              <td>{item.email}</td>
              <td>{item.averagePhysicalHealth.toFixed(2)}</td>
              <td>{item.averageMentalHealth.toFixed(2)}</td>
              <td>{item.averageStressLevel.toFixed(2)}</td>
              <td>{item.averagePerformanceRating.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Teammates;
