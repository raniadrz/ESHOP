/* eslint-disable no-unused-vars */
import React from 'react';
import Layout from '../../../components/layout/Layout';
import './ReturnPolicy.css'; // Import CSS file for styling

function ReturnPolicy() {
  return (
    <Layout>
      <div className="return-policy-container">
        <h1>Return Policy</h1>
        <br/>
          <h2>The Pet Paradise Return Policy</h2>
            <p>
              The Pet Shop will accept returns or exchanges within 14 days from the original purchase date.
              Your original receipt is required for all returns and exchanges, no exceptions.
              The merchandise must be unused and in its original package & condition. Special orders cannot be returned or exchanged for any reason.
              The Pet Shop reserves the right to deny any return.
            </p>
        <br/>
        <h2>The Pet Paradise Live Stock Policy</h2>
            <p>
              We pride ourselves on providing you with healthy, loving animals.
              Due to the wide variety of variables that can occur between our home to yours we do not guarantee our animals after they have left our shop.
              If you have any questions please consult a Pet Shop employee when making your decision and please choose wisely.
              All of our animals are quarantined until they are ready for their new homes. 
              If you see an animal in our shop that is not priced it means it is still within our quarantine period and not currently available.
              If you have any questions getting your new pet accustomed/established to your home please contact us.
            </p>
      </div>
    </Layout>
  );
}

export default ReturnPolicy;
