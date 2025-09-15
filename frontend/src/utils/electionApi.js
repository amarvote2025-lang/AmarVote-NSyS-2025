// API utility functions for election-related operations
export const electionApi = {
  /**
   * Fetch all elections accessible to the current user
   * This includes elections where the user is:
   * - A voter (in allowed voters list)
   * - An admin (admin_email matches)
   * - A guardian
   */
  async getAllElections() {
    try {
      const response = await fetch('/api/all-elections', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching elections:', error);
      throw error;
    }
  },

  /**
   * Create a new election
   */
  async createElection(electionData) {
    try {
      const response = await fetch('/api/create-election', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(electionData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating election:', error);
      throw error;
    }
  },

  /**
   * Fetch detailed election information by ID
   * Returns null if user is not authorized to view the election
   */
  async getElectionById(electionId) {
    try {
      const response = await fetch(`/api/election/${electionId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching election details:', error);
      throw error;
    }
  },

  /**
   * Cast a ballot for an election
   */
  async castBallot(electionId, choiceId, optionTitle, botDetectionData = null) {
    try {
      const requestBody = {
        electionId,
        selectedCandidate: optionTitle
      };

      // Include bot detection data if provided
      if (botDetectionData) {
        requestBody.botDetection = botDetectionData;
      }

      const response = await fetch('/api/cast-ballot', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Error casting ballot:', error);
      throw error;
    }
  },

  /**
   * Create an encrypted ballot without casting it
   */
  async createEncryptedBallot(electionId, choiceId, optionTitle, botDetectionData = null) {
    try {
      const requestBody = {
        electionId,
        selectedCandidate: optionTitle
      };

      // Include bot detection data if provided
      if (botDetectionData) {
        requestBody.botDetection = botDetectionData;
      }

      const response = await fetch('/api/create-encrypted-ballot', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Error creating encrypted ballot:', error);
      throw error;
    }
  },

  /**
   * Cast a pre-encrypted ballot
   */
  async castEncryptedBallot(electionId, encrypted_ballot, ballot_hash, ballot_tracking_code) {
    try {
      const requestBody = {
        electionId,
        encrypted_ballot,
        ballot_hash,
        ballot_tracking_code
      };

      const response = await fetch('/api/cast-encrypted-ballot', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Error casting encrypted ballot:', error);
      throw error;
    }
  },

  /**
   * Perform Benaloh challenge on an encrypted ballot
   */
  async performBenalohChallenge(electionId, encrypted_ballot_with_nonce, candidate_name) {
    try {
      const requestBody = {
        electionId,
        encrypted_ballot_with_nonce,
        candidate_name
      };

      const response = await fetch('/api/benaloh-challenge', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Error performing Benaloh challenge:', error);
      throw error;
    }
  },

  /**
   * Check if user is eligible to vote in a specific election
   * Returns an object with the following properties:
   * - canVote: boolean indicating if the user can vote in this election
   * - hasVoted: boolean indicating if the user has already voted in this election
   * - reason: string explaining why the user can't vote (if applicable)
   */
  async checkEligibility(electionId) {
    try {
      const response = await fetch('/api/eligibility', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          electionId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking eligibility:', error);
      throw error;
    }
  },

  /**
   * Create tally for an election (automatically called when election page loads)
   */
  async createTally(electionId) {
    try {
      const response = await fetch('/api/create-tally', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          election_id: electionId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating tally:', error);
      throw error;
    }
  },

  /**
   * Submit guardian partial decryption credentials
   */
  async submitGuardianKey(electionId, encryptedCredentials) {
    try {
      const response = await fetch('/api/create-partial-decryption', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          election_id: electionId,
          encrypted_data: encryptedCredentials
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error submitting guardian credentials:', error);
      throw error;
    }
  },

  /**
   * Combine partial decryptions to get final results
   */
  async combinePartialDecryptions(electionId) {
    try {
      const response = await fetch('/api/combine-partial-decryption', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          election_id: electionId
        }),
      });
      console.log('Combine partial decryptions response in the frontend:', response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error combining partial decryptions:', error);
      throw error;
    }
  },

  /**
   * Verify a vote using tracking code and hash
   */
  async verifyVote(electionId, verificationData) {
    try {
      const response = await fetch('/api/verify-vote', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          election_id: electionId,
          tracking_code: verificationData.tracking_code,
          hash_code: verificationData.hash_code
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error verifying vote:', error);
      throw error;
    }
  },

  /**
   * Get ballots in tally for verification
   */
  async getBallotsInTally(electionId) {
    try {
      const response = await fetch(`/api/ballots-in-tally/${electionId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting ballots in tally:', error);
      throw error;
    }
  },

  /**
   * Get blockchain logs for an election
   */
  async getBlockchainLogs(electionId) {
    try {
      const response = await fetch(`/api/blockchain/logs/${electionId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Get response text for better error handling
      const responseText = await response.text();

      if (!response.ok) {
        // If there's an error, try to parse the response as JSON for a structured error message
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        } catch (e) {
          // If parsing fails, throw the raw text as the error
          throw new Error(responseText || `HTTP error! status: ${response.status}`);
        }
      }

      // If response is OK, parse it as JSON
      const data = JSON.parse(responseText);

      if (!data.success) {
        throw new Error(data.message || 'Operation failed');
      }

      return data;
    } catch (error) {
      console.error('Error fetching blockchain logs:', error);
      throw error;
    }
  },

  /**
   * Verify a ballot on the blockchain
   */
  async verifyBallotOnBlockchainAPI(electionId, trackingCode) {
    try {
      const response = await fetch(`/api/blockchain/ballot/${electionId}/${trackingCode}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const responseText = await response.text();
      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        } catch (e) {
          throw new Error(responseText || `HTTP error! status: ${response.status}`);
        }
      }
      const data = JSON.parse(responseText);
      if (!data.success) {
        throw new Error(data.message || 'Operation failed');
      }
      return data;
    } catch (error) {
      console.error('Error verifying ballot on blockchain:', error);
      throw error;
    }
  },

  /**
   * Get ballot details including cipher text by election ID and tracking code
   */
  async getBallotDetails(electionId, trackingCode) {
    try {
      const response = await fetch(`/api/ballot-details/${electionId}/${trackingCode}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting ballot details:', error);
      throw error;
    }
  },
};
