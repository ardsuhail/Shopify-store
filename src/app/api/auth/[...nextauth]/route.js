import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import User from '@/model/User'
import connectDB from '@/db/connectDB'
// 🆕 Shopify Customer ID Fetch Function
async function getShopifyCustomerId(email) {
  try {
    const shopifyRes = await fetch(
      `https://${process.env.MY_STORE}/admin/api/2024-10/customers/search.json?query=email:${email}`,
      {
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_TOKEN,
        },
      }
    );

    const data = await shopifyRes.json();
    const shopifyCustomerId = data?.customers?.[0]?.id;

    return shopifyCustomerId ? shopifyCustomerId.toString() : null;
  } catch (error) {
    console.error("Shopify fetch error:", error);
    return null;
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, profile }) {
      try {
        await connectDB()

        // let existingUser = await User.findOne({ email: user.email })

        let existingUser = await User.findOne({ googleUserId: profile.sub });

        if (!existingUser) {
          const usernameFromEmail = user.email.split('@')[0];

          existingUser = await User.create({
            name: profile?.name || user.name,
            profilePicture: profile?.picture || user.image,
            username: usernameFromEmail,
            email: user.email,
            googleUserId: profile.sub,
            shopifyCustomerIds: [],
          });
        }

        const shopifyId = await getShopifyCustomerId(user.email);
        if (shopifyId && !existingUser.shopifyCustomerIds.includes(shopifyId)) {
          existingUser.shopifyCustomerIds.push(shopifyId);
          await existingUser.save();
        }
        // 🟢 If user exists, don’t overwrite their updated profile
        return true
      } catch (error) {
        console.error('SignIn Error:', error)
        return false
      }
    },

    async session({ session }) {
      await connectDB()
      const userData = await User.findOne({ email: session.user.email })

      if (userData) {
        session.user = {
          id: userData._id,
          name: userData.name,
          username: userData.username,
          email: userData.email,
          profilePicture: userData.profilePicture,
          phone: userData.phone,
          gender: userData.gender,
          dateOfBirth: userData.dateOfBirth,
          address: userData.address,
          shopifyCustomerIds: userData.shopifyCustomerIds // ✅ add Shopify IDs
        }
      }

      return session
    },
  },
})

export { handler as GET, handler as POST }

