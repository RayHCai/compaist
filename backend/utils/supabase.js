// utils/supabaseUtils.js
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/**
 * Get the user's wallet address from the profiles table
 * @param {string} userId
 * @returns {string} Wallet address
 */
async function getUserWallet(userId) {
    const { data, error } = await supabase
        .from("profiles")
        .select("wallet_address")
        .eq("id", userId)
        .single();

    if (error || !data.wallet_address) throw new Error("Wallet not found.");
    return data.wallet_address;
}

module.exports = { getUserWallet };
