import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Clear existing data ───────────────────────────────────────────────────
  await prisma.notification.deleteMany();
  await prisma.creditScore.deleteMany();
  await prisma.insuranceClaim.deleteMany();
  await prisma.insuranceSubscription.deleteMany();
  await prisma.loanApplication.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.lease.deleteMany();
  await prisma.property.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.insurancePlan.deleteMany();
  await prisma.user.deleteMany();

  console.log("  ✓ Cleared existing data");

  // ─── Insurance Plans ──────────────────────────────────────────────────────
  const basicPlan = await prisma.insurancePlan.create({
    data: {
      id: "plan-basic",
      name: "Basic Cover",
      price: 1500,
      description: "Essential protection for tenants",
      features: JSON.stringify([
        { label: "Rent coverage up to KES 50K", included: true },
        { label: "1 claim per 12 months", included: true },
        { label: "14-day processing", included: true },
        { label: "Income disruption cover", included: true },
        { label: "Legal eviction protection", included: false },
        { label: "Medical emergency rental aid", included: false },
        { label: "Priority claim handling", included: false },
        { label: "Dedicated support agent", included: false },
      ]),
    },
  });

  const premiumPlan = await prisma.insurancePlan.create({
    data: {
      id: "plan-premium",
      name: "Premium Cover",
      price: 3500,
      description: "Full protection & priority service",
      features: JSON.stringify([
        { label: "Rent coverage up to KES 150K", included: true },
        { label: "3 claims per 12 months", included: true },
        { label: "48-hour processing", included: true },
        { label: "Income disruption cover", included: true },
        { label: "Legal eviction protection", included: true },
        { label: "Medical emergency rental aid", included: true },
        { label: "Priority claim handling", included: true },
        { label: "Dedicated support agent", included: true },
      ]),
    },
  });

  console.log("  ✓ Insurance plans created");

  // ─── Users ────────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("rentmo2026", 10);

  const admin = await prisma.user.create({
    data: {
      id: "user-admin",
      email: "admin@rentmo.online",
      password: hashedPassword,
      name: "Rentmo Admin",
      phone: "+254757551875",
      role: "ADMIN",
      kycStatus: "VERIFIED",
    },
  });

  const landlord1 = await prisma.user.create({
    data: {
      id: "user-landlord-1",
      email: "fatima@rentmo.online",
      password: hashedPassword,
      name: "Fatima Ali",
      phone: "+254711000001",
      role: "LANDLORD",
      kycStatus: "VERIFIED",
    },
  });

  const landlord2 = await prisma.user.create({
    data: {
      id: "user-landlord-2",
      email: "david@rentmo.online",
      password: hashedPassword,
      name: "David Njoroge",
      phone: "+254711000002",
      role: "LANDLORD",
      kycStatus: "VERIFIED",
    },
  });

  const tenant1 = await prisma.user.create({
    data: {
      id: "user-tenant-1",
      email: "james@rentmo.online",
      password: hashedPassword,
      name: "James Kamau",
      phone: "+254722000001",
      role: "TENANT",
      kycStatus: "VERIFIED",
    },
  });

  const tenant2 = await prisma.user.create({
    data: {
      id: "user-tenant-2",
      email: "amara@rentmo.online",
      password: hashedPassword,
      name: "Amara Ochieng",
      phone: "+254722000002",
      role: "TENANT",
      kycStatus: "VERIFIED",
    },
  });

  const tenant3 = await prisma.user.create({
    data: {
      id: "user-tenant-3",
      email: "sarah@rentmo.online",
      password: hashedPassword,
      name: "Sarah Wanjiku",
      phone: "+254722000003",
      role: "TENANT",
      kycStatus: "PENDING",
    },
  });

  console.log("  ✓ Users created (password: rentmo2026)");

  // ─── Properties ───────────────────────────────────────────────────────────
  const props = await Promise.all([
    prisma.property.create({
      data: {
        id: "prop-1",
        title: "Modern 3BR Apartment",
        description:
          "Stunning 3-bedroom apartment in the heart of Kilimani with panoramic city views. Fully fitted kitchen, en-suite master bedroom, and access to world-class amenities including a gym and rooftop pool.",
        location: "Kilimani, Nairobi",
        neighborhood: "Kilimani",
        price: 85000,
        type: "RENT_TO_OWN",
        bedrooms: 3,
        bathrooms: 2,
        size: 1400,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
        ]),
        features: JSON.stringify([
          "Gym",
          "Swimming Pool",
          "Parking",
          "24/7 Security",
          "Backup Generator",
        ]),
        available: true,
        rating: 4.8,
        reviews: 24,
        propertyValue: 18500000,
        equityRate: 15,
        ownerId: landlord1.id,
      },
    }),
    prisma.property.create({
      data: {
        id: "prop-2",
        title: "Cozy 2BR Apartment",
        description:
          "Comfortable 2-bedroom apartment in Westlands with a stunning rooftop terrace. Modern finishes, high-speed internet, and a fully fitted kitchen make this ideal for young professionals.",
        location: "Westlands, Nairobi",
        neighborhood: "Westlands",
        price: 65000,
        type: "RENT",
        bedrooms: 2,
        bathrooms: 2,
        size: 950,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
        ]),
        features: JSON.stringify([
          "Rooftop Terrace",
          "High-Speed WiFi",
          "Modern Kitchen",
          "Parking",
        ]),
        available: true,
        rating: 4.6,
        reviews: 18,
        ownerId: landlord1.id,
      },
    }),
    prisma.property.create({
      data: {
        id: "prop-3",
        title: "Spacious 4BR Villa",
        description:
          "Magnificent 4-bedroom villa in Karen on a half-acre plot. Features a private garden, detached guest house, staff quarters, and a 3-car garage. Perfect for families seeking space and exclusivity.",
        location: "Karen, Nairobi",
        neighborhood: "Karen",
        price: 150000,
        type: "RENT_TO_OWN",
        bedrooms: 4,
        bathrooms: 3,
        size: 2800,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
          "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=800&q=80",
        ]),
        features: JSON.stringify([
          "Private Garden",
          "Guest House",
          "Staff Quarters",
          "3-Car Garage",
          "Solar Power",
        ]),
        available: true,
        rating: 4.9,
        reviews: 31,
        propertyValue: 45000000,
        equityRate: 20,
        ownerId: landlord2.id,
      },
    }),
    prisma.property.create({
      data: {
        id: "prop-4",
        title: "Studio Apartment",
        description:
          "Affordable and well-appointed studio in the leafy Lavington area. Fully furnished, water included, and internet-ready. Perfect for a single professional.",
        location: "Lavington, Nairobi",
        neighborhood: "Lavington",
        price: 28000,
        type: "RENT",
        bedrooms: 1,
        bathrooms: 1,
        size: 450,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
        ]),
        features: JSON.stringify([
          "Fully Furnished",
          "Water Included",
          "Internet Ready",
          "Secure Parking",
        ]),
        available: true,
        rating: 4.3,
        reviews: 12,
        ownerId: landlord2.id,
      },
    }),
    prisma.property.create({
      data: {
        id: "prop-5",
        title: "Luxury 2BR Penthouse",
        description:
          "Exclusive penthouse on the top floor with sweeping city views. Features a private rooftop terrace, concierge service, smart home technology, and EV charging. The pinnacle of Nairobi luxury living.",
        location: "Kileleshwa, Nairobi",
        neighborhood: "Kileleshwa",
        price: 120000,
        type: "RENT_TO_OWN",
        bedrooms: 2,
        bathrooms: 2,
        size: 1600,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
        ]),
        features: JSON.stringify([
          "City Views",
          "Rooftop Pool",
          "Concierge",
          "EV Charging",
          "Smart Home",
        ]),
        available: false,
        rating: 4.9,
        reviews: 8,
        propertyValue: 35000000,
        equityRate: 18,
        ownerId: landlord1.id,
      },
    }),
    prisma.property.create({
      data: {
        id: "prop-6",
        title: "3BR Townhouse",
        description:
          "Spacious 3-bedroom townhouse in the serene Parklands neighbourhood. Features a private garden, dedicated study room, and servant quarters. Walking distance to major shopping centres, schools, and public transport.",
        location: "Parklands, Nairobi",
        neighborhood: "Parklands",
        price: 75000,
        type: "RENT",
        bedrooms: 3,
        bathrooms: 2,
        size: 1800,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
        ]),
        features: JSON.stringify([
          "Private Garden",
          "2-Car Garage",
          "Study Room",
          "Servant Quarters",
        ]),
        available: true,
        rating: 4.5,
        reviews: 15,
        ownerId: landlord2.id,
      },
    }),
    prisma.property.create({
      data: {
        id: "prop-7",
        title: "Riverside Studio",
        description:
          "Compact yet stylish studio apartment along Riverside Drive. Ideal for young professionals. Fully furnished with modern amenities and excellent security.",
        location: "Riverside, Nairobi",
        neighborhood: "Riverside",
        price: 29000,
        type: "RENT",
        bedrooms: 1,
        bathrooms: 1,
        size: 450,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
        ]),
        features: JSON.stringify([
          "Fully Furnished",
          "Fast WiFi",
          "Water Included",
          "24/7 Security",
          "Modern Kitchen",
          "Secure Parking",
        ]),
        available: true,
        rating: 4.4,
        reviews: 9,
        ownerId: landlord2.id,
      },
    }),
  ]);

  console.log("  ✓ Properties created");

  // ─── Leases ───────────────────────────────────────────────────────────────
  const lease1 = await prisma.lease.create({
    data: {
      id: "lease-1",
      propertyId: props[0].id, // Kilimani 3BR
      tenantId: tenant1.id,    // James Kamau
      startDate: new Date("2025-04-01"),
      endDate: new Date("2026-04-01"),
      monthlyRent: 85000,
      status: "ACTIVE",
      equityBuilt: 34,
    },
  });

  const lease2 = await prisma.lease.create({
    data: {
      id: "lease-2",
      propertyId: props[1].id, // Westlands 2BR
      tenantId: tenant2.id,    // Amara Ochieng
      startDate: new Date("2025-06-01"),
      endDate: new Date("2026-06-01"),
      monthlyRent: 65000,
      status: "ACTIVE",
      equityBuilt: 0,
    },
  });

  console.log("  ✓ Leases created");

  // ─── Payments ─────────────────────────────────────────────────────────────
  const months = [
    { month: "Oct", year: 2025, date: "2025-10-18" },
    { month: "Nov", year: 2025, date: "2025-11-18" },
    { month: "Dec", year: 2025, date: "2025-12-18" },
    { month: "Jan", year: 2026, date: "2026-01-18" },
    { month: "Feb", year: 2026, date: "2026-02-18" },
    { month: "Mar", year: 2026, date: "2026-03-18" },
  ];

  const methods = ["MPESA", "MPESA", "CARD", "MPESA", "MPESA", "BANK"];

  for (let i = 0; i < months.length; i++) {
    await prisma.payment.create({
      data: {
        leaseId: lease1.id,
        tenantId: tenant1.id,
        amount: 85000,
        method: methods[i],
        status: "COMPLETED",
        transactionRef: `TXN-${1091 - (5 - i) * 46}`,
        description: `${months[i].month} ${months[i].year} Rent`,
        createdAt: new Date(months[i].date),
      },
    });
  }

  // Loan disbursement payment
  await prisma.payment.create({
    data: {
      tenantId: tenant1.id,
      amount: 50000,
      method: "LOAN",
      status: "COMPLETED",
      transactionRef: "LOAN-0022",
      description: "Rent Loan Disbursement",
      createdAt: new Date("2025-09-28"),
    },
  });

  // Amara's payments
  for (let i = 0; i < 4; i++) {
    await prisma.payment.create({
      data: {
        leaseId: lease2.id,
        tenantId: tenant2.id,
        amount: 65000,
        method: "MPESA",
        status: "COMPLETED",
        transactionRef: `TXN-AMR-${i + 1}`,
        description: `${months[i + 2].month} ${months[i + 2].year} Rent`,
        createdAt: new Date(months[i + 2].date),
      },
    });
  }

  console.log("  ✓ Payments created");

  // ─── Loan Applications ────────────────────────────────────────────────────
  await prisma.loanApplication.create({
    data: {
      tenantId: tenant1.id,
      amount: 50000,
      purpose: "September 2025 rent — temporarily short due to delayed salary",
      status: "REPAID",
      monthlyRepayment: 17000,
      interestRate: 8.5,
      disbursedAt: new Date("2025-09-15"),
      repaidAt: new Date("2025-12-15"),
      notes: "Repaid in 3 installments. Excellent repayment behavior.",
    },
  });

  await prisma.loanApplication.create({
    data: {
      tenantId: tenant2.id,
      amount: 65000,
      purpose: "Emergency — medical expense impacted this month's rent",
      status: "PENDING",
      notes: null,
    },
  });

  console.log("  ✓ Loan applications created");

  // ─── Insurance ────────────────────────────────────────────────────────────
  const sub1 = await prisma.insuranceSubscription.create({
    data: {
      userId: tenant1.id,
      planId: basicPlan.id,
      status: "active",
      renewsAt: new Date("2026-06-01"),
    },
  });

  await prisma.insuranceClaim.create({
    data: {
      subscriptionId: sub1.id,
      userId: tenant1.id,
      reason: "Income disruption",
      amount: 85000,
      description: "Salary was delayed for 3 weeks due to company payroll issues.",
      status: "APPROVED",
      reference: "CLM-0021",
      filedAt: new Date("2026-01-15"),
      resolvedAt: new Date("2026-01-20"),
    },
  });

  await prisma.insuranceSubscription.create({
    data: {
      userId: tenant2.id,
      planId: premiumPlan.id,
      status: "active",
      renewsAt: new Date("2026-06-01"),
    },
  });

  console.log("  ✓ Insurance records created");

  // ─── Credit Scores ────────────────────────────────────────────────────────
  await prisma.creditScore.create({
    data: {
      userId: tenant1.id,
      score: 720,
      history: JSON.stringify([
        { month: "Oct", year: 2025, score: 640 },
        { month: "Nov", year: 2025, score: 655 },
        { month: "Dec", year: 2025, score: 670 },
        { month: "Jan", year: 2026, score: 690 },
        { month: "Feb", year: 2026, score: 705 },
        { month: "Mar", year: 2026, score: 720 },
      ]),
    },
  });

  await prisma.creditScore.create({
    data: {
      userId: tenant2.id,
      score: 675,
      history: JSON.stringify([
        { month: "Dec", year: 2025, score: 500 },
        { month: "Jan", year: 2026, score: 580 },
        { month: "Feb", year: 2026, score: 630 },
        { month: "Mar", year: 2026, score: 675 },
      ]),
    },
  });

  console.log("  ✓ Credit scores created");

  // ─── Notifications ────────────────────────────────────────────────────────
  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  await prisma.notification.createMany({
    data: [
      {
        userId: tenant1.id,
        title: "Rent due in 5 days",
        message: "KES 85,000 due on April 18, 2026",
        type: "warning",
        read: false,
        createdAt: twoHoursAgo,
      },
      {
        userId: tenant1.id,
        title: "Credit score updated",
        message: "Your score increased by 15 points to 720",
        type: "success",
        read: false,
        createdAt: oneDayAgo,
      },
      {
        userId: tenant1.id,
        title: "Lease renewal coming up",
        message: "Your lease expires in 45 days",
        type: "info",
        read: false,
        createdAt: twoDaysAgo,
      },
      {
        userId: tenant2.id,
        title: "Loan application received",
        message: "Your loan application for KES 65,000 is under review",
        type: "info",
        read: false,
        createdAt: oneDayAgo,
      },
      {
        userId: landlord1.id,
        title: "Rent received",
        message: "James Kamau paid KES 85,000 for March 2026",
        type: "success",
        read: true,
        createdAt: new Date("2026-03-18"),
      },
    ],
  });

  console.log("  ✓ Notifications created");

  console.log("\n✅ Seeding complete!");
  console.log("\n📋 Test accounts (all password: rentmo2026):");
  console.log("   admin@rentmo.online     — Admin");
  console.log("   fatima@rentmo.online    — Landlord");
  console.log("   david@rentmo.online     — Landlord");
  console.log("   james@rentmo.online     — Tenant (active lease, credit score 720)");
  console.log("   amara@rentmo.online     — Tenant (active lease, credit score 675)");
  console.log("   sarah@rentmo.online     — Tenant (no lease, KYC pending)");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
