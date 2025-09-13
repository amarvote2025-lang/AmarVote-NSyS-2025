package com.amarvote.amarvote.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ElectionGuardBallotResponse {
    
    private String ballot_hash;
    private String encrypted_ballot;
    private String encrypted_ballot_with_nonce;  // New field for Benaloh challenge
    private String ballot_id;
    private String ballot_status;
    private String publication_status;
    private String status;
}
