"use client";

import { useMemo, useState, useEffect } from "react";

type Lang = "sv" | "en" | "de";
type Location = "all" | "airport" | "city";
type SortKey = "popular" | "price-asc" | "price-desc" | "rating";

interface Car {
  id: string;
  name: string;
  category: string;
  image: string;
  supplier: string;
  supplierRating: number;
  ratingLabel: string;
  pricePerDay: number;
  seats: number;
  transmission: string;
  freeCancellation: boolean;
  isAirport: boolean;
  locationName: string;
  bookUrl: string;
}

const CARS: Car[] = [
  {
    id: "S9VP",
    name: "SEAT Arona",
    category: "Economy",
    image: "https://www.discovercars.com/images/car/7048/220.png",
    supplier: "Europcar",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 963,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-S9VP?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJiYmRmNDVlZDViYTY4ODdmZTJlYTA3NDI3NDNiYjA0ZCJ9",
  },
  {
    id: "B85C",
    name: "Peugeot 2008",
    category: "Compact",
    image: "https://www.discovercars.com/images/car/8695/220.png",
    supplier: "Avis",
    supplierRating: 8.7,
    ratingLabel: "Excellent",
    pricePerDay: 974,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-B85C?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI2Y2JmOTgwOGZiM2U4ZDhlMDA2NzY0NTAyZWNmNWJmNyJ9",
  },
  {
    id: "BDKU",
    name: "Skoda Scala",
    category: "Compact",
    image: "https://www.discovercars.com/images/car/8014/220.png",
    supplier: "Europcar",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1014,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-BDKU?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJiOGQzMmJmZTllYjlmNTdkODliZWM1N2Y3NzdjZGM1MyJ9",
  },
  {
    id: "C5MD",
    name: "Volkswagen ID.3",
    category: "Intermediate",
    image: "https://www.discovercars.com/images/car/8532/220.png",
    supplier: "Europcar",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1116,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-C5MD?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI1NzJjMmEzOGVjYzc1YWE3Yzg3ZGY4MTFkYzFhN2QyZCJ9",
  },
  {
    id: "36QK",
    name: "Volkswagen Golf",
    category: "Compact",
    image: "https://www.discovercars.com/images/car/7737/220.png",
    supplier: "Europcar",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1116,
    seats: 5,
    transmission: "Manuell",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-36QK?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJhNWYxNzBiZGRhOTcwOWFlYWE2NzkwYmI3YmE5M2UxZiJ9",
  },
  {
    id: "QGJW",
    name: "Kia Ceed STW",
    category: "Compact Estate/Wagon",
    image: "https://www.discovercars.com/images/car/6791/220.png",
    supplier: "Avis",
    supplierRating: 8.7,
    ratingLabel: "Excellent",
    pricePerDay: 1117,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-QGJW?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI5NmFlNjEwOTNjMDk0YzVjMTA4ZTQ5MmI0ZjkwMDI1NCJ9",
  },
  {
    id: "RPPD",
    name: "Kia Stonic",
    category: "Compact SUV",
    image: "https://fdsa.work/imagessx/sx105373519.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1144,
    seats: 5,
    transmission: "Manuell",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-RPPD?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiIwNGRhZDhjZjkzOTNmZmNkN2E0MzM2MzE3OGEzOThhOCJ9",
  },
  {
    id: "4PU3",
    name: "Audi A1",
    category: "Economy",
    image: "https://fdsa.work/imagessx/sx105373520.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1153,
    seats: 4,
    transmission: "Manuell",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-4PU3?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJmZjI1MmU4YWFmMzYwZGRhMzE5ZDI3MjE3ZGJiMTY4MiJ9",
  },
  {
    id: "Y5WW",
    name: "Volkswagen Golf",
    category: "Compact",
    image: "https://fdsa.work/imagessx/sx8707.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1179,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-Y5WW?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI3MGRhZjI5MjBhZWRjNDJkMmE0OTEwMzlmOWM4ZTQ4ZCJ9",
  },
  {
    id: "EXGD",
    name: "VW T-Roc",
    category: "Compact SUV",
    image: "https://fdsa.work/imagessx/sx21269345.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1197,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-EXGD?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJkOTkzM2FjNWIwOGQ3MzViZDE0ZTIxNGZkYmFmYTQ2MiJ9",
  },
  {
    id: "NP84",
    name: "BYD Seal",
    category: "Standard Crossover",
    image: "https://www.discovercars.com/images/car/8980/220.png",
    supplier: "Avis",
    supplierRating: 8.7,
    ratingLabel: "Excellent",
    pricePerDay: 1216,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-NP84?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI2ZDc2MjcyNzYyYjUyZDI4YjE1NzhmMjZhZmRlNWJmMSJ9",
  },
  {
    id: "9BVL",
    name: "Volvo EX30",
    category: "Compact SUV",
    image: "https://fdsa.work/imagessx/sx110441454.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1223,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-9BVL?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI5ZDgzYzYyYWE5NzU4YjBkYWJiYzg1NjM0MDEyZGEyNCJ9",
  },
  {
    id: "P26C",
    name: "Peugeot 3008",
    category: "Intermediate",
    image: "https://www.discovercars.com/images/car/486/220.png",
    supplier: "Dollar",
    supplierRating: 8.3,
    ratingLabel: "Very Good",
    pricePerDay: 1263,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-P26C?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI0NDBjOTAzYjBjMTJkYjFlZjY3NjI1MjY1ZjczMzIyYiJ9",
  },
  {
    id: "HULW",
    name: "BMW 1 Series",
    category: "Compact Estate/Wagon",
    image: "https://fdsa.work/imagessx/sx111596353.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1301,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-HULW?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI4NjM0NjZhZTgyOGNjYTU1NTEwZTg3NmQ2ODZhNjBjOCJ9",
  },
  {
    id: "YYKT",
    name: "Volvo EX40",
    category: "Standard SUV",
    image: "https://fdsa.work/imagessx/sx123326744.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1310,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-YYKT?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI2MjI0MWIyYTRjZjQ2NmYzMWQxMGM4OGVkM2FhZDkxNCJ9",
  },
  {
    id: "RN26",
    name: "Hyundai i10",
    category: "Mini",
    image: "https://www.discovercars.com/images/car/8224/220.png",
    supplier: "Europcar",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1319,
    seats: 4,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-RN26?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI5OTBlOTE0NzM0ZmQxMDgwYzA5N2YwMmUzODUwMWMxNSJ9",
  },
  {
    id: "E9NP",
    name: "Volkswagen Golf STW",
    category: "Compact Estate/Wagon",
    image: "https://www.discovercars.com/images/car/8367/220.png",
    supplier: "Europcar",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1338,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-E9NP?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiIxZGNiYTM5MWFmMjE2NzU4YjllOTU2NTA5ODdlYTQzYSJ9",
  },
  {
    id: "DCPP",
    name: "Audi Q5",
    category: "Premium SUV",
    image: "https://www.discovercars.com/images/car/8727/220.png",
    supplier: "Europcar",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1348,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-DCPP?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJjZTE5Yzk2NjNkZjY4OWEwNThiZjMyMGUxZWY3NWIyMiJ9",
  },
  {
    id: "M5P2",
    name: "Skoda Octavia STW",
    category: "Intermediate Estate/Wagon",
    image: "https://www.discovercars.com/images/car/107/220.png",
    supplier: "Europcar",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1369,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-M5P2?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI4ZGJkNmYyMzYyODEyYzFmYWI2MjU1NTUyYjMyNWIyMiJ9",
  },
  {
    id: "C5TJ",
    name: "Audi Q2",
    category: "Compact Elite",
    image: "https://www.discovercars.com/images/car/7145/220.png",
    supplier: "Europcar",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1369,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-C5TJ?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI3YTQ2NjNlYTBkM2IxMzI0YjE4OTg5ZmVlNDc0MTcyOCJ9",
  },
  {
    id: "RQAP",
    name: "Lynk & Co 01",
    category: "Standard SUV",
    image: "https://fdsa.work/imagessx/sx47845528.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1371,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-RQAP?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJjZTc3NWY3MDkwMGRlMTkwMWFkMjI5ZWI0N2M2MjA1NSJ9",
  },
  {
    id: "DC4G",
    name: "Peugeot 3008",
    category: "Intermediate",
    image: "https://www.discovercars.com/images/car/486/220.png",
    supplier: "Thrifty",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1395,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-DC4G?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiIzNWVkNmZmOTcwNThkMDg5OTlmNjYwMTM0ZDZkMjBkMSJ9",
  },
  {
    id: "YN4S",
    name: "Cupra Formentor",
    category: "Standard Crossover",
    image: "https://www.discovercars.com/images/car/8692/220.png",
    supplier: "Europcar",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1420,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-YN4S?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJhNGM0MmMzN2EyNDQ0ZjFhZGQzYTc4ODI4MDNmNmZjOSJ9",
  },
  {
    id: "DTLG",
    name: "Volvo XC40",
    category: "Standard SUV",
    image: "https://www.discovercars.com/images/car/7151/220.png",
    supplier: "Dollar",
    supplierRating: 8.3,
    ratingLabel: "Very Good",
    pricePerDay: 1422,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-DTLG?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI2ODE4NTEwNDhkMzAyYTVlZGE3OTdhZWY1ODc4YzY3YyJ9",
  },
  {
    id: "3DUH",
    name: "Volvo EX30",
    category: "Intermediate Elite Crossover",
    image: "https://www.discovercars.com/images/car/8877/220.png",
    supplier: "Thrifty",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1437,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-3DUH?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJjZTMxZDg5NjAxM2MxYTBlNTRjZGQyYjMzYWJkNmQyOSJ9",
  },
  {
    id: "3GM6",
    name: "Peugeot 3008",
    category: "Intermediate",
    image: "https://www.discovercars.com/images/car/486/220.png",
    supplier: "Hertz",
    supplierRating: 8.7,
    ratingLabel: "Excellent",
    pricePerDay: 1441,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-3GM6?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJmMDBlODhiMDlmYTk4NjQ1NjA3YWI5ZDRjMGVlNTk2MCJ9",
  },
  {
    id: "BBL7",
    name: "Tesla Model 3",
    category: "Full-size",
    image: "https://fdsa.work/imagessx/sx10572959.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1450,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-BBL7?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJlYzUzNDNmOWZjNWU0M2M5ZWU3MjJmNjExNTk5Y2JjZCJ9",
  },
  {
    id: "HJHY",
    name: "Audi Q3",
    category: "Intermediate Elite SUV",
    image: "https://www.discovercars.com/images/car/8859/220.png",
    supplier: "Europcar",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1471,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-HJHY?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI0ODhkZDZjZDNhNTg3NjA5ZGZiZGU3MTU2MjZjNTgzNiJ9",
  },
  {
    id: "462H",
    name: "Skoda Karoq",
    category: "Intermediate Crossover",
    image: "https://www.discovercars.com/images/car/7818/220.png",
    supplier: "Europcar",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1471,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-462H?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJiOGIwOTBjMGQ0YTk5NjlmY2RkZjU4M2RkYTNiZTkzNCJ9",
  },
  {
    id: "3V5B",
    name: "Volvo EX30",
    category: "Intermediate Elite Crossover",
    image: "https://www.discovercars.com/images/car/8877/220.png",
    supplier: "Dollar",
    supplierRating: 8.3,
    ratingLabel: "Very Good",
    pricePerDay: 1483,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-3V5B?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJhNGI0YzI1NjY4ZDcwN2NhN2YyOGU1Nzc3OWEzNjA1ZCJ9",
  },
  {
    id: "98X9",
    name: "Volvo XC40",
    category: "Standard SUV",
    image: "https://www.discovercars.com/images/car/7151/220.png",
    supplier: "Thrifty",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1493,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-98X9?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJmNzM2OWIwNTEzZDY1YWY5NjRmYzE4ODYzODVlY2JlOSJ9",
  },
  {
    id: "NAYY",
    name: "Skoda Octavia STW",
    category: "Standard Estate/Wagon",
    image: "https://www.discovercars.com/images/car/7185/220.png",
    supplier: "Avis",
    supplierRating: 8.7,
    ratingLabel: "Excellent",
    pricePerDay: 1520,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-NAYY?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJhOGJkMDZkMDE1YzQ1MjU5M2QxOTE0ZDg4YjY0YTY2NyJ9",
  },
  {
    id: "FNYR",
    name: "Peugeot 5008",
    category: "Standard SUV",
    image: "https://www.discovercars.com/images/car/534/220.png",
    supplier: "Budget",
    supplierRating: 8.6,
    ratingLabel: "Excellent",
    pricePerDay: 1534,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-FNYR?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI2MTY0OGI1ZmUwN2U4NTY0ZGI3M2U4MmUyOTRhYjQzOCJ9",
  },
  {
    id: "MJMN",
    name: "Volvo EX30",
    category: "Intermediate Elite Crossover",
    image: "https://www.discovercars.com/images/car/8877/220.png",
    supplier: "Hertz",
    supplierRating: 8.7,
    ratingLabel: "Excellent",
    pricePerDay: 1547,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-MJMN?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI0NGQzMGI1ZmRiNjhkNzM2ZWFmOGU3ODljYzgzMzFjYSJ9",
  },
  {
    id: "EHUD",
    name: "Volkswagen Tiguan",
    category: "Full-size SUV",
    image: "https://fdsa.work/imagessx/sx123254486.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1554,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-EHUD?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJjNDQ1N2VjYmE2YThkN2I4Yjc4NDNjYzIwOGNmNTMxMyJ9",
  },
  {
    id: "L2BS",
    name: "Audi A4 STW",
    category: "Full-size Estate/Wagon",
    image: "https://fdsa.work/imagessx/sx111596355.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1572,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-L2BS?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI0MWI1YTY3NDE4ODM5YzJkYzQ3NzljOTgxNTcyYzZjOSJ9",
  },
  {
    id: "9RJV",
    name: "Volkswagen Passat STW",
    category: "Standard Estate/Wagon",
    image: "https://www.discovercars.com/images/car/8299/220.png",
    supplier: "Europcar",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1623,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-9RJV?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiIzMDlkMWYwNzBhMjY0ZWZlYzliZDZjZWI4YjVjMDMwMiJ9",
  },
  {
    id: "2JVC",
    name: "Volvo XC40",
    category: "Standard SUV",
    image: "https://www.discovercars.com/images/car/7151/220.png",
    supplier: "Hertz",
    supplierRating: 8.7,
    ratingLabel: "Excellent",
    pricePerDay: 1628,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-2JVC?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI3NjZmZjcwMDNiYjU3Y2VkYzJiNWM2ZTNmYTk2ZjNmNyJ9",
  },
  {
    id: "TR88",
    name: "Tesla Model Y",
    category: "Premium SUV",
    image: "https://fdsa.work/imagessx/sx40794831.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1644,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-TR88?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJiMmExMDUxMmQ5NTNlYTVhYzEyZDRjNjIzZTgzMmE5MiJ9",
  },
  {
    id: "Y4B4",
    name: "Volvo V60",
    category: "Full-size Elite Estate/Wagon",
    image: "https://www.discovercars.com/images/car/8745/220.png",
    supplier: "Thrifty",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1646,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-Y4B4?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJmM2ZhM2Q0MTZjYTQxNzZiODliZTU4MmYzOTM5ZTM0MSJ9",
  },
  {
    id: "CXRR",
    name: "Volkswagen Tiguan",
    category: "Standard Crossover",
    image: "https://www.discovercars.com/images/car/7443/220.png",
    supplier: "Europcar",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1674,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-CXRR?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI5NjVjYmU1ODE4OGFlZjk3NzZjNzlkMjVkMzdkZDgxYiJ9",
  },
  {
    id: "MKB8",
    name: "Peugeot 5008 5+2",
    category: "Standard SUV",
    image: "https://www.discovercars.com/images/car/8826/220.png",
    supplier: "Avis",
    supplierRating: 8.7,
    ratingLabel: "Excellent",
    pricePerDay: 1689,
    seats: 7,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-MKB8?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJiNjY2M2Y5NmVkNjc1ZDI2MjQxMmI1OGU3OTUzMTc3YSJ9",
  },
  {
    id: "5LCP",
    name: "KIA Ceed STW Plug-in",
    category: "Full-size Estate/Wagon",
    image: "https://fdsa.work/imagessx/sx123216322.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1701,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-5LCP?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiIyMjEzNzMxMTMzNjZhOTAyOTM3YzZkYjU4MWIyMDRjMiJ9",
  },
  {
    id: "DKWR",
    name: "Skoda Kodiaq",
    category: "Standard SUV",
    image: "https://www.discovercars.com/images/car/8368/220.png",
    supplier: "Europcar",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1725,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-DKWR?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiIwZTRlODFjYTQ3OTNhNWZmODVmZmI3YWNjZDA0OTU0NiJ9",
  },
  {
    id: "WC4M",
    name: "Lexus NX",
    category: "Premium SUV",
    image: "https://fdsa.work/imagessx/sx110441458.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1759,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-WC4M?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI2YmQ2NGEzYWVlOTRiYzFjNGY3YzFhNmRmOTgyNzNkZiJ9",
  },
  {
    id: "U2KF",
    name: "VW Passat",
    category: "Premium Estate/Wagon",
    image: "https://fdsa.work/imagessx/sx117819875.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1759,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-U2KF?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI5Mjk4N2EzM2MxMDU2YjIyZDRhZjliZWY2OTVjNTgwYSJ9",
  },
  {
    id: "GEGU",
    name: "Audi A4 STW",
    category: "Premium Estate/Wagon",
    image: "https://www.discovercars.com/images/car/6670/220.png",
    supplier: "Europcar",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1775,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-GEGU?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI4OWU0OGEzNTEwNjA2NDgyNzQyMmQwMzQzMzk5OTgxMSJ9",
  },
  {
    id: "JVVR",
    name: "Audi A6 STW",
    category: "Luxury Estate/Wagon",
    image: "https://www.discovercars.com/images/car/8387/220.png",
    supplier: "Europcar",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1876,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-JVVR?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJjYjkyMGFiM2IwYTlhODA0NDE4MDk1NzIxZDNkZmJiNCJ9",
  },
  {
    id: "WTLR",
    name: "Audi A6 Avant 4x4",
    category: "Premium Estate/Wagon",
    image: "https://fdsa.work/imagessx/sx110814741.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1884,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-WTLR?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJhMGQ4NjAwNTcyY2NiZTQxMmI5YzJmYTIxYjc4MGU5NCJ9",
  },
  {
    id: "JYW7",
    name: "Mercedes-Benz EQE",
    category: "Premium",
    image: "https://fdsa.work/imagessx/sx27350425.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1897,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-JYW7?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiIwNTY0MjQyY2VmZWY3ZTAxZmMzZjBlZTZiZjgwOGIxYSJ9",
  },
  {
    id: "U4WG",
    name: "Volvo V90 Hybrid",
    category: "Premium Estate/Wagon",
    image: "https://fdsa.work/imagessx/sx123301493.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1923,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-U4WG?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI4OTNhMDEyYTI2ODhmMzRhZGYyNDU0ZjRkOTFjODdjMCJ9",
  },
  {
    id: "9AV4",
    name: "Volvo V60",
    category: "Full-size Elite Estate/Wagon",
    image: "https://www.discovercars.com/images/car/8745/220.png",
    supplier: "Hertz",
    supplierRating: 8.7,
    ratingLabel: "Excellent",
    pricePerDay: 1944,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-9AV4?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiIyMzhhM2M4NGVhMDMwZTNhZjdjMGJlOTY0OWQ2MmQyOCJ9",
  },
  {
    id: "HE4L",
    name: "Volvo XC60 4x4",
    category: "Premium SUV",
    image: "https://fdsa.work/imagessx/sx8046890.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1961,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-HE4L?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJkMzY0OTI4NTE4NjY3N2FhMDUzM2E4ODE5ZDc3ZTRjOSJ9",
  },
  {
    id: "A8VC",
    name: "Volvo XC60",
    category: "Premium SUV",
    image: "https://www.discovercars.com/images/car/733/220.png",
    supplier: "Dollar",
    supplierRating: 8.3,
    ratingLabel: "Very Good",
    pricePerDay: 2259,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-A8VC?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI1MTYyOWQyM2I1YjBjYzNiMWM3YmUwZDVhYjllYTk5NiJ9",
  },
  {
    id: "L2PJ",
    name: "Volvo V60",
    category: "Full-size Elite Estate/Wagon",
    image: "https://www.discovercars.com/images/car/8745/220.png",
    supplier: "Dollar",
    supplierRating: 8.3,
    ratingLabel: "Very Good",
    pricePerDay: 2410,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-L2PJ?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI1MzE1NDRkMzkzNWJkZmE4OWFlMmIzZmU2N2RmODc2YSJ9",
  },
  {
    id: "2RD3",
    name: "Volvo XC90",
    category: "Special",
    image: "https://fdsa.work/imagessx/sx118704901.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 2666,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-2RD3?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJlZDZlNTkxMTc1ZDUxNzA1ZTY0N2EzMWFlN2YwODU5OCJ9",
  },
  {
    id: "EBM5",
    name: "Volkswagen Multivan",
    category: "Full-size Elite Van",
    image: "https://www.discovercars.com/images/car/2016/220.png",
    supplier: "Europcar",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 2695,
    seats: 7,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-EBM5?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiIxOTNhMmQwYjdjODQzY2JlYzc3N2I3NWQ5ZmFiNWUwYiJ9",
  },
  {
    id: "VB8Y",
    name: "Volkswagen Caravelle",
    category: "Luxury Van",
    image: "https://www.discovercars.com/images/car/3505/220.png",
    supplier: "Europcar",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 2808,
    seats: 9,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-VB8Y?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI4OTU1YzcyZTBlNjE0ZTM4MzAxNTEzMTA0ZTRkNWU3YSJ9",
  },
  {
    id: "DXBB",
    name: "Mercedes-Benz Vito Tourer",
    category: "Full-size Van",
    image: "https://fdsa.work/imagessx/sx111596359.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 3134,
    seats: 9,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-DXBB?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJkZGNhZTkxOWQ3NDc2OTU0YTY0OWFjYmEzNmQ3N2U2YiJ9",
  },
  {
    id: "GN5H",
    name: "Volvo XC60",
    category: "Premium SUV",
    image: "https://www.discovercars.com/images/car/733/220.png",
    supplier: "Thrifty",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 3156,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-GN5H?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJmZmRjNWZjMzg4M2Q1OGRjMWYxZWRkZDBiMjkwZjYxZCJ9",
  },
  {
    id: "VTDS",
    name: "Volvo XC60",
    category: "Premium SUV",
    image: "https://www.discovercars.com/images/car/733/220.png",
    supplier: "Hertz",
    supplierRating: 8.7,
    ratingLabel: "Excellent",
    pricePerDay: 3687,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/se/offer/7bc82ebf-9e41-4da2-a0d9-f0c854d29139-VTDS?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI5ODI3MGQ1OGUxZDllNjFjMjM1NTI2ZmI1MWUzMTAwZCJ9",
  },
  {
    id: "SM96",
    name: "Peugeot 2008",
    category: "Compact",
    image: "https://www.discovercars.com/images/car/8392/220.png",
    supplier: "Budget",
    supplierRating: 8.6,
    ratingLabel: "Excellent",
    pricePerDay: 885,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: false,
    locationName: "Malmö City",
    bookUrl: "https://www.discovercars.com/se/offer/459cdcc6-97bc-4cea-8998-e0ad6c22de79-SM96?sq=eyJQaWNrdXBMb2NhdGlvbklkIjo3MzI4LCJEcm9wT2ZmTG9jYXRpb25JZCI6NzMyOCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI0MGU0N2JkOWE2NGU2MzY4NDU0MGFhNWIxM2RkYzE1YiJ9",
  },
  {
    id: "U5SU",
    name: "Kia Stonic",
    category: "Compact SUV",
    image: "https://fdsa.work/imagessx/sx105373519.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 913,
    seats: 5,
    transmission: "Manuell",
    freeCancellation: true,
    isAirport: false,
    locationName: "Malmö City",
    bookUrl: "https://www.discovercars.com/se/offer/ca8ac3ef-8b72-4196-895e-36fd63451f29-U5SU?sq=eyJQaWNrdXBMb2NhdGlvbklkIjozNTY1LCJEcm9wT2ZmTG9jYXRpb25JZCI6MzU2NSwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI1ZDY3OWExMjVhZjRiODk1MjNiYWUzYmIyM2Y2MjhhYiJ9",
  },
  {
    id: "GG6L",
    name: "Volkswagen Golf",
    category: "Compact",
    image: "https://fdsa.work/imagessx/sx8707.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 950,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: false,
    locationName: "Malmö City",
    bookUrl: "https://www.discovercars.com/se/offer/ca8ac3ef-8b72-4196-895e-36fd63451f29-GG6L?sq=eyJQaWNrdXBMb2NhdGlvbklkIjozNTY1LCJEcm9wT2ZmTG9jYXRpb25JZCI6MzU2NSwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI2ZGRiNTk0M2RiNGZkMWNlOWY3OWFmNTBhMjQ4MWEwMSJ9",
  },
  {
    id: "7LB3",
    name: "Peugeot 2008",
    category: "Compact",
    image: "https://www.discovercars.com/images/car/8695/220.png",
    supplier: "Avis",
    supplierRating: 8.7,
    ratingLabel: "Excellent",
    pricePerDay: 974,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: false,
    locationName: "Malmö City",
    bookUrl: "https://www.discovercars.com/se/offer/a7caa328-dee6-43d3-94cf-c8ceeb5b0620-7LB3?sq=eyJQaWNrdXBMb2NhdGlvbklkIjozNTkzMzUsIkRyb3BPZmZMb2NhdGlvbklkIjozNTkzMzUsIlBpY2t1cERhdGVUaW1lIjoiMjAyNi0wNS0xOFQxMTowMDowMCIsIkRyb3BPZmZEYXRlVGltZSI6IjIwMjYtMDUtMTlUMTE6MDA6MDAiLCJSZXNpZGVuY2VDb3VudHJ5IjoiU0UiLCJEcml2ZXJBZ2UiOjM1LCJIYXNoIjoiNmNiZjk4MDhmYjNlOGQ4ZTAwNjc2NDUwMmVjZjViZjcifQ%3D%3D",
  },
  {
    id: "S43L",
    name: "VW T-Roc",
    category: "Compact SUV",
    image: "https://fdsa.work/imagessx/sx21269345.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 968,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: false,
    locationName: "Malmö City",
    bookUrl: "https://www.discovercars.com/se/offer/ca8ac3ef-8b72-4196-895e-36fd63451f29-S43L?sq=eyJQaWNrdXBMb2NhdGlvbklkIjozNTY1LCJEcm9wT2ZmTG9jYXRpb25JZCI6MzU2NSwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJjNjExODJhMWE1YjYxY2U5YTdlOGEzNGVjNTRkNjY3NiJ9",
  },
  {
    id: "L6ST",
    name: "Lynk & Co 01",
    category: "Standard SUV",
    image: "https://fdsa.work/imagessx/sx47845528.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 9.0,
    ratingLabel: "Outstanding",
    pricePerDay: 1251,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: false,
    locationName: "Malmö City",
    bookUrl: "https://www.discovercars.com/se/offer/459cdcc6-97bc-4cea-8998-e0ad6c22de79-L6ST?sq=eyJQaWNrdXBMb2NhdGlvbklkIjo3MzI4LCJEcm9wT2ZmTG9jYXRpb25JZCI6NzMyOCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI3N2IyOTcxMDhmYjlkNGM1MzNmYWI4MmIyODgzNWNhOSJ9",
  },
  {
    id: "MBAX",
    name: "Volkswagen Tiguan",
    category: "Full-size SUV",
    image: "https://fdsa.work/imagessx/sx123254486.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 9.0,
    ratingLabel: "Outstanding",
    pricePerDay: 1409,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: false,
    locationName: "Malmö City",
    bookUrl: "https://www.discovercars.com/se/offer/459cdcc6-97bc-4cea-8998-e0ad6c22de79-MBAX?sq=eyJQaWNrdXBMb2NhdGlvbklkIjo3MzI4LCJEcm9wT2ZmTG9jYXRpb25JZCI6NzMyOCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI5MTBkYTJlYWRjN2I3N2EzZTRmM2U4N2ZlN2IxNDQyZCJ9",
  },
  {
    id: "KH8T",
    name: "Lexus NX",
    category: "Premium SUV",
    image: "https://fdsa.work/imagessx/sx110441458.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 9.0,
    ratingLabel: "Outstanding",
    pricePerDay: 1575,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: false,
    locationName: "Malmö City",
    bookUrl: "https://www.discovercars.com/se/offer/459cdcc6-97bc-4cea-8998-e0ad6c22de79-KH8T?sq=eyJQaWNrdXBMb2NhdGlvbklkIjo3MzI4LCJEcm9wT2ZmTG9jYXRpb25JZCI6NzMyOCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI1YWYzYzA3MTUxOTY0MDlmMWI2ZTNjMjZlYWU1NjQ4OSJ9",
  },
  {
    id: "UJ3T",
    name: "Volvo XC60 4x4",
    category: "Premium SUV",
    image: "https://fdsa.work/imagessx/sx8046890.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 9.0,
    ratingLabel: "Outstanding",
    pricePerDay: 1733,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: false,
    locationName: "Malmö City",
    bookUrl: "https://www.discovercars.com/se/offer/459cdcc6-97bc-4cea-8998-e0ad6c22de79-UJ3T?sq=eyJQaWNrdXBMb2NhdGlvbklkIjo3MzI4LCJEcm9wT2ZmTG9jYXRpb25JZCI6NzMyOCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkhhc2giOiJhYjQzMzBjMzRlODE3NWFmOTczYWY1YjgzYzFmN2YwZiJ9",
  },
  {
    id: "S3Y3",
    name: "Audi A1",
    category: "Economy",
    image: "https://fdsa.work/imagessx/sx105373520.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 9.0,
    ratingLabel: "Outstanding",
    pricePerDay: 1063,
    seats: 4,
    transmission: "Manuell",
    freeCancellation: true,
    isAirport: false,
    locationName: "Malmö City",
    bookUrl: "https://www.discovercars.com/se/offer/459cdcc6-97bc-4cea-8998-e0ad6c22de79-S3Y3?sq=eyJQaWNrdXBMb2NhdGlvbklkIjo3MzI4LCJEcm9wT2ZmTG9jYXRpb25JZCI6NzMyOCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiIzMTg5YWQzMDgwNzlmYzViZDg1OTNjNjBkZmNiMzMwNiJ9",
  },
  {
    id: "DHBY",
    name: "Hyundai i10",
    category: "Mini",
    image: "https://www.discovercars.com/images/car/8224/220.png",
    supplier: "Europcar",
    supplierRating: 8.4,
    ratingLabel: "Very Good",
    pricePerDay: 1015,
    seats: 4,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: false,
    locationName: "Malmö City",
    bookUrl: "https://www.discovercars.com/se/offer/ca8ac3ef-8b72-4196-895e-36fd63451f29-DHBY?sq=eyJQaWNrdXBMb2NhdGlvbklkIjozNTY1LCJEcm9wT2ZmTG9jYXRpb25JZCI6MzU2NSwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI5OTBlOTE0NzM0ZmQxMDgwYzA5N2YwMmUzODUwMWMxNSJ9",
  },
  {
    id: "HNEV",
    name: "Renault Captur",
    category: "Compact",
    image: "https://www.discovercars.com/images/car/8089/220.png",
    supplier: "Hertz",
    supplierRating: 8.6,
    ratingLabel: "Excellent",
    pricePerDay: 1052,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: false,
    locationName: "Malmö City",
    bookUrl: "https://www.discovercars.com/se/offer/a7caa328-dee6-43d3-94cf-c8ceeb5b0620-HNEV?sq=eyJQaWNrdXBMb2NhdGlvbklkIjozNTkzMzUsIkRyb3BPZmZMb2NhdGlvbklkIjozNTkzMzUsIlBpY2t1cERhdGVUaW1lIjoiMjAyNi0wNS0xOFQxMTowMDowMCIsIkRyb3BPZmZEYXRlVGltZSI6IjIwMjYtMDUtMTlUMTE6MDA6MDAiLCJSZXNpZGVuY2VDb3VudHJ5IjoiU0UiLCJEcml2ZXJBZ2UiOjM1LCJIYXNoIjoiYjZlZDhhYmI0ZWU4OTkzNWYzZjI1ODdhYmE5MTVkYTMifQ%3D%3D",
  },
  {
    id: "AWAS",
    name: "Peugeot 5008 5+2",
    category: "Standard SUV",
    image: "https://www.discovercars.com/images/car/8826/220.png",
    supplier: "Avis",
    supplierRating: 8.7,
    ratingLabel: "Excellent",
    pricePerDay: 1689,
    seats: 7,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: false,
    locationName: "Malmö City",
    bookUrl: "https://www.discovercars.com/se/offer/a7caa328-dee6-43d3-94cf-c8ceeb5b0620-AWAS?sq=eyJQaWNrdXBMb2NhdGlvbklkIjozNTkzMzUsIkRyb3BPZmZMb2NhdGlvbklkIjozNTkzMzUsIlBpY2t1cERhdGVUaW1lIjoiMjAyNi0wNS0xOFQxMTowMDowMCIsIkRyb3BPZmZEYXRlVGltZSI6IjIwMjYtMDUtMTlUMTE6MDA6MDAiLCJSZXNpZGVuY2VDb3VudHJ5IjoiU0UiLCJEcml2ZXJBZ2UiOjM1LCJIYXNoIjoiYjY2NjNmOTZlZDY3NWQyNjI0MTJiNThlNzk1MzE3N2EifQ%3D%3D",
  },
  {
    id: "NR88",
    name: "Kia Sportage",
    category: "Standard SUV",
    image: "https://www.discovercars.com/images/car/8229/220.png",
    supplier: "Avis",
    supplierRating: 8.7,
    ratingLabel: "Excellent",
    pricePerDay: 1689,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: false,
    locationName: "Malmö City",
    bookUrl: "https://www.discovercars.com/se/offer/a7caa328-dee6-43d3-94cf-c8ceeb5b0620-NR88?sq=eyJQaWNrdXBMb2NhdGlvbklkIjozNTkzMzUsIkRyb3BPZmZMb2NhdGlvbklkIjozNTkzMzUsIlBpY2t1cERhdGVUaW1lIjoiMjAyNi0wNS0xOFQxMTowMDowMCIsIkRyb3BPZmZEYXRlVGltZSI6IjIwMjYtMDUtMTlUMTE6MDA6MDAiLCJSZXNpZGVuY2VDb3VudHJ5IjoiU0UiLCJEcml2ZXJBZ2UiOjM1LCJIYXNoIjoiZGZkOTBkMzE4OTdlNjgxMjEwMjY0OTM2ZDE0MDMwYWEifQ%3D%3D",
  },
  {
    id: "6R6F",
    name: "Volvo EX30",
    category: "Compact SUV",
    image: "https://fdsa.work/imagessx/sx110441454.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 9.0,
    ratingLabel: "Outstanding",
    pricePerDay: 1123,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: false,
    locationName: "Malmö City",
    bookUrl: "https://www.discovercars.com/se/offer/459cdcc6-97bc-4cea-8998-e0ad6c22de79-6R6F?sq=eyJQaWNrdXBMb2NhdGlvbklkIjo3MzI4LCJEcm9wT2ZmTG9jYXRpb25JZCI6NzMyOCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJkOTNkODYwODZiMTY3MmY4NDBkMjM2MjczZTFiMmY2ZCJ9",
  },
  {
    id: "7DBP",
    name: "Tesla Model Y",
    category: "Premium SUV",
    image: "https://fdsa.work/imagessx/sx40794831.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 9.0,
    ratingLabel: "Outstanding",
    pricePerDay: 1485,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: false,
    locationName: "Malmö City",
    bookUrl: "https://www.discovercars.com/se/offer/459cdcc6-97bc-4cea-8998-e0ad6c22de79-7DBP?sq=eyJQaWNrdXBMb2NhdGlvbklkIjo3MzI4LCJEcm9wT2ZmTG9jYXRpb25JZCI6NzMyOCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI4ZmIxYWIwNTdiNjcyYTk5YmY0NDc5NzZkNTQ2NmRhNCJ9",
  },
  {
    id: "RQS8",
    name: "Volvo EX40",
    category: "Standard SUV",
    image: "https://fdsa.work/imagessx/sx123326744.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 9.0,
    ratingLabel: "Outstanding",
    pricePerDay: 1198,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: false,
    locationName: "Malmö City",
    bookUrl: "https://www.discovercars.com/se/offer/459cdcc6-97bc-4cea-8998-e0ad6c22de79-RQS8?sq=eyJQaWNrdXBMb2NhdGlvbklkIjo3MzI4LCJEcm9wT2ZmTG9jYXRpb25JZCI6NzMyOCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI2MjI0MWIyYTRjZjQ2NmYzMWQxMGM4OGVkM2FhZDkxNCJ9",
  },
  {
    id: "R4LQ",
    name: "Mercedes-Benz EQE",
    category: "Luxury SUV",
    image: "https://fdsa.work/imagessx/sx110662612.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 9.0,
    ratingLabel: "Outstanding",
    pricePerDay: 1987,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: false,
    locationName: "Malmö City",
    bookUrl: "https://www.discovercars.com/se/offer/459cdcc6-97bc-4cea-8998-e0ad6c22de79-R4LQ?sq=eyJQaWNrdXBMb2NhdGlvbklkIjo3MzI4LCJEcm9wT2ZmTG9jYXRpb25JZCI6NzMyOCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiIzOTM2Y2IzMjZiMDA4MzZjNDU0N2Q1ZjVmMzgyYzljZSJ9",
  },
  {
    id: "BEME",
    name: "Kia Niro",
    category: "Compact SUV",
    image: "https://www.discovercars.com/images/car/7978/220.png",
    supplier: "Avis",
    supplierRating: 8.7,
    ratingLabel: "Excellent",
    pricePerDay: 1122,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: false,
    locationName: "Malmö City",
    bookUrl: "https://www.discovercars.com/se/offer/a7caa328-dee6-43d3-94cf-c8ceeb5b0620-BEME?sq=eyJQaWNrdXBMb2NhdGlvbklkIjozNTkzMzUsIkRyb3BPZmZMb2NhdGlvbklkIjozNTkzMzUsIlBpY2t1cERhdGVUaW1lIjoiMjAyNi0wNS0xOFQxMTowMDowMCIsIkRyb3BPZmZEYXRlVGltZSI6IjIwMjYtMDUtMTlUMTE6MDA6MDAiLCJSZXNpZGVuY2VDb3VudHJ5IjoiU0UiLCJEcml2ZXJBZ2UiOjM1LCJIYXNoIjoiY2Q1M2E0NjhmYTVmYTBhMmExYjcxYWM2MzM4NDk3Y2MifQ%3D%3D",
  },
  {
    id: "APDG",
    name: "BYD Seal",
    category: "Compact",
    image: "https://www.discovercars.com/images/car/8980/220.png",
    supplier: "Avis",
    supplierRating: 8.7,
    ratingLabel: "Excellent",
    pricePerDay: 1216,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: false,
    locationName: "Malmö City",
    bookUrl: "https://www.discovercars.com/se/offer/a7caa328-dee6-43d3-94cf-c8ceeb5b0620-APDG?sq=eyJQaWNrdXBMb2NhdGlvbklkIjozNTkzMzUsIkRyb3BPZmZMb2NhdGlvbklkIjozNTkzMzUsIlBpY2t1cERhdGVUaW1lIjoiMjAyNi0wNS0xOFQxMTowMDowMCIsIkRyb3BPZmZEYXRlVGltZSI6IjIwMjYtMDUtMTlUMTE6MDA6MDAiLCJSZXNpZGVuY2VDb3VudHJ5IjoiU0UiLCJEcml2ZXJBZ2UiOjM1LCJIYXNoIjoiNmQ3NjI3Mjc2MmI1MmQyOGIxNTc4ZjI2YWZkZTViZjEifQ%3D%3D",
  },
  {
    id: "2T23",
    name: "Kia Niro",
    category: "Compact SUV",
    image: "https://www.discovercars.com/images/car/7978/220.png",
    supplier: "Budget",
    supplierRating: 8.6,
    ratingLabel: "Excellent",
    pricePerDay: 1019,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: false,
    locationName: "Malmö City",
    bookUrl: "https://www.discovercars.com/se/offer/459cdcc6-97bc-4cea-8998-e0ad6c22de79-2T23?sq=eyJQaWNrdXBMb2NhdGlvbklkIjo3MzI4LCJEcm9wT2ZmTG9jYXRpb25JZCI6NzMyOCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI1ZjQzMWI3MWNkM2RjMjIxM2M5YzgwYmM2NTBmMmJjZSJ9",
  },
  {
    id: "MQMF",
    name: "Volvo XC90",
    category: "Luxury SUV",
    image: "https://fdsa.work/imagessx/sx118704901.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 9.0,
    ratingLabel: "Outstanding",
    pricePerDay: 2288,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    isAirport: false,
    locationName: "Malmö City",
    bookUrl: "https://www.discovercars.com/se/offer/459cdcc6-97bc-4cea-8998-e0ad6c22de79-MQMF?sq=eyJQaWNrdXBMb2NhdGlvbklkIjo3MzI4LCJEcm9wT2ZmTG9jYXRpb25JZCI6NzMyOCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJlZDBkNjUzYzI1YmI1NzA0Mzc5OTVmMzgyMThkNGFjZiJ9",
  },
];


const SUPPLIERS = [...new Set(CARS.map((c) => c.supplier))].sort();

type SizeGroup = "all" | "small" | "medium" | "large";
const SIZE_MAP: Record<string, SizeGroup> = {
  "Mini": "small",
  "Economy": "small",
  "Compact": "small",
  "Compact SUV": "small",
  "Compact Elite": "small",
  "Compact Estate/Wagon": "small",
  "Intermediate": "medium",
  "Intermediate Elite Crossover": "medium",
  "Intermediate Crossover": "medium",
  "Intermediate Elite SUV": "medium",
  "Intermediate Estate/Wagon": "medium",
  "Standard Crossover": "medium",
  "Standard SUV": "medium",
  "Standard Estate/Wagon": "medium",
  "Full-size": "medium",
  "Full-size Estate/Wagon": "medium",
  "Full-size SUV": "large",
  "Full-size Elite Estate/Wagon": "large",
  "Full-size Elite Van": "large",
  "Full-size Van": "large",
  "Premium": "large",
  "Premium SUV": "large",
  "Premium Estate/Wagon": "large",
  "Luxury SUV": "large",
  "Luxury Van": "large",
  "Luxury Estate/Wagon": "large",
  "Special": "large",
};

const PER_PAGE = 12;

function norm(s: string) {
  return s.toLowerCase()
    .replace(/å/g, "a").replace(/ä/g, "a").replace(/ö/g, "o")
    .replace(/é|è|ê/g, "e").replace(/ü/g, "u");
}

// Levenshtein distance för stavfelstolerans
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) => [i]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

function fuzzyMatch(text: string, q: string): boolean {
  if (text.includes(q)) return true;
  // Tillåt 1 stavfel för ord längre än 4 tecken
  const words = text.split(/\s+/);
  return words.some(w => w.length > 4 && q.length > 3 && levenshtein(w, q) <= 1);
}

// Synonymer och alternativa stavningar
const SYNONYMS: Record<string, string[]> = {
  // Storlekar
  liten: ["small", "mini", "economy", "compact", "liten", "litet", "pytteliten"],
  small: ["liten", "mini", "economy", "compact"],
  mini: ["liten", "small", "economy"],
  economy: ["liten", "ekonomi", "small", "mini"],
  compact: ["liten", "small", "kompakt"],
  mellan: ["medium", "intermediate", "standard", "mellanstor", "mellanstora"],
  medium: ["mellan", "intermediate", "standard"],
  intermediate: ["mellan", "medium"],
  standard: ["mellan", "medium"],
  stor: ["large", "fullsize", "full", "suv", "van", "premium", "luxury", "big", "stora"],
  large: ["stor", "fullsize", "full"],
  fullsize: ["stor", "large", "full"],
  suv: ["stor", "large", "fyrhjul"],
  van: ["stor", "minibuss", "minivan", "familj"],
  premium: ["stor", "lyx", "luxury"],
  luxury: ["lyx", "premium", "stor"],
  // Transmission
  automat: ["automatic", "auto"],
  automatic: ["automat", "auto"],
  manuell: ["manual", "växellåda"],
  manual: ["manuell"],
  // Övrigt
  familj: ["van", "stor", "suv", "7"],
  elektrisk: ["electric", "el", "elbil"],
  electric: ["elektrisk", "el"],
  elbil: ["electric", "elektrisk"],
  billig: ["cheap", "low", "economy", "mini"],
  cheap: ["billig", "economy"],
  airport: ["flygplats", "flyg", "malmo airport"],
  flygplats: ["airport", "flyg"],
  city: ["stad", "centrum"],
};

function expandQuery(q: string): string[] {
  const terms = [q];
  const syns = SYNONYMS[q];
  if (syns) terms.push(...syns);
  return terms;
}

const T = {
  sv: {
    title: "Hitta", em: "din hyrbil", sub: (n: number) => `${n} hyrbilar i Malmö — jämför pris, betyg och upphämtningsplats.`,
    location: "Upphämtningsplats", allLocations: "Alla",
    airport: "Malmö Airport", city: "Malmö City",
    rating: "Betyg", allRatings: "Alla betyg",
    r9: "9+", r85: "8.5+", r8: "8+",
    supplier: "Biluthyrningsföretag", allSuppliers: "Alla",
    category: "Biltyp", sizeSmall: "Liten", sizeMedium: "Mellan", sizeLarge: "Stor",
    sort: "Sortera", popular: "Populärast", priceAsc: "Lägsta pris", priceDesc: "Högsta pris", ratingSort: "Bäst betyg",
    filter: "Filter",
    search: "Sök bilmodell, kategori eller företag…",
    showing: (a: number, b: number, t: number) => `Visar ${a}–${b} av ${t}`,
    perDay: "/dag",
    seats: "säten",
    freeCancellation: "Fri avbokning",
    book: "Visa erbjudande →",
    empty: "Inga bilar matchar dina filter.",
    reset: "Rensa filter",
    prev: "Föregående", next: "Nästa",
    unlimited: "Obegränsad",
  },
  en: {
    title: "Find", em: "your rental car", sub: (n: number) => `${n} rental cars in Malmö — compare price, rating and pickup location.`,
    location: "Pickup location", allLocations: "All",
    airport: "Malmö Airport", city: "Malmö City",
    rating: "Rating", allRatings: "All ratings",
    r9: "9+", r85: "8.5+", r8: "8+",
    supplier: "Car rental company", allSuppliers: "All",
    category: "Car type", sizeSmall: "Small", sizeMedium: "Medium", sizeLarge: "Large",
    sort: "Sort", popular: "Most popular", priceAsc: "Lowest price", priceDesc: "Highest price", ratingSort: "Best rating",
    filter: "Filter",
    search: "Search car model, category or company…",
    showing: (a: number, b: number, t: number) => `Showing ${a}–${b} of ${t}`,
    perDay: "/day",
    seats: "seats",
    freeCancellation: "Free cancellation",
    book: "View offer →",
    empty: "No cars match your filters.",
    reset: "Clear filters",
    prev: "Previous", next: "Next",
    unlimited: "Unlimited",
  },
  de: {
    title: "Finde", em: "dein Mietauto", sub: (n: number) => `${n} Mietautos in Malmö — Preis, Bewertung und Abholort vergleichen.`,
    location: "Abholort", allLocations: "Alle",
    airport: "Flughafen Malmö", city: "Malmö City",
    rating: "Bewertung", allRatings: "Alle",
    r9: "9+", r85: "8,5+", r8: "8+",
    supplier: "Autovermieter", allSuppliers: "Alle",
    category: "Fahrzeugtyp", sizeSmall: "Klein", sizeMedium: "Mittel", sizeLarge: "Groß",
    sort: "Sortieren", popular: "Beliebteste", priceAsc: "Günstigster Preis", priceDesc: "Höchster Preis", ratingSort: "Beste Bewertung",
    filter: "Filter",
    search: "Automodell, Kategorie oder Anbieter suchen…",
    showing: (a: number, b: number, t: number) => `Zeige ${a}–${b} von ${t}`,
    perDay: "/Tag",
    seats: "Sitze",
    freeCancellation: "Kostenlose Stornierung",
    book: "Angebot ansehen →",
    empty: "Keine Autos entsprechen Ihren Filtern.",
    reset: "Filter zurücksetzen",
    prev: "Vorherige", next: "Nächste",
    unlimited: "Unbegrenzt",
  },
};

export default function HyraBilList() {
  const [lang, setLang] = useState<Lang>("sv");
  const [location, setLocation] = useState<Location>("all");
  const [minRating, setMinRating] = useState<string>("all");
  const [supplier, setSupplier] = useState<string>("all");
  const [size, setSize] = useState<SizeGroup>("all");
  const [sort, setSort] = useState<SortKey>("popular");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const readLang = () => {
      try {
        const saved = localStorage.getItem("dm-lang") as Lang;
        if (saved && ["sv", "en", "de"].includes(saved)) setLang(saved);
      } catch {}
    };
    const onCustom = (e: Event) => {
      const l = (e as CustomEvent).detail as Lang;
      if (["sv", "en", "de"].includes(l)) setLang(l);
    };
    readLang();
    window.addEventListener("storage", readLang);
    window.addEventListener("dm-lang-change", onCustom);
    return () => {
      window.removeEventListener("storage", readLang);
      window.removeEventListener("dm-lang-change", onCustom);
    };
  }, []);

  const filtered = useMemo(() => {
    let list = CARS;
    if (location !== "all") list = list.filter((c) => c.isAirport === (location === "airport"));
    if (minRating !== "all") list = list.filter((c) => c.supplierRating >= parseFloat(minRating));
    if (supplier !== "all") list = list.filter((c) => c.supplier === supplier);
    if (size !== "all") list = list.filter((c) => (SIZE_MAP[c.category] ?? "medium") === size);
    if (query.trim()) {
      const terms = query.trim().split(/\s+/).map(norm);
      list = list.filter((c) => {
        const sizeLabel = norm(SIZE_MAP[c.category] ?? "medium");
        const fields = [
          norm(c.name),
          norm(c.category),
          norm(c.supplier),
          norm(c.ratingLabel),
          norm(c.transmission),
          sizeLabel,
        ].join(" ");
        return terms.every((term) => {
          const expanded = expandQuery(term);
          return expanded.some((t) => fuzzyMatch(fields, t));
        });
      });
    }
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.pricePerDay - b.pricePerDay);
    else if (sort === "price-desc") sorted.sort((a, b) => b.pricePerDay - a.pricePerDay);
    else if (sort === "rating") sorted.sort((a, b) => b.supplierRating - a.supplierRating);
    else sorted.sort((a, b) => b.supplierRating - a.supplierRating);
    return sorted;
  }, [location, minRating, supplier, size, sort, query]);

  useEffect(() => { setPage(1); }, [location, minRating, supplier, size, sort, query]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const t = T[lang];

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilters = () => {
    setLocation("all"); setMinRating("all"); setSupplier("all");
    setSize("all"); setQuery("");
  };

  return (
    <div className="upp-page hb-page">
      <header className="upp-header">
        <div className="upp-header-inner">
          <h1 className="upp-title">
            {t.title} <em>{t.em}</em>
          </h1>
          <p className="upp-sub">{t.sub(CARS.length)}</p>
          <div className="upp-search">
            <svg width="16" height="16" viewBox="0 0 16 16" className="upp-search-icon" aria-hidden="true">
              <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="11" y1="11" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="search"
              placeholder={t.search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={t.search}
            />
          </div>
        </div>
      </header>

      <div className="upp-mob-bar">
        <button className="upp-filter-toggle-btn" onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {t.filter}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{flexShrink:0}}>
            <path d={filtersOpen ? "M2 8l4-4 4 4" : "M2 4l4 4 4-4"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="upp-sort-pill">
          <span>{t.sort}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label={t.sort}>
            <option value="popular">{t.popular}</option>
            <option value="price-asc">{t.priceAsc}</option>
            <option value="price-desc">{t.priceDesc}</option>
            <option value="rating">{t.ratingSort}</option>
          </select>
        </div>
      </div>

      <section className={`upp-filters hb-filters${filtersOpen ? " mob-open" : ""}`} aria-label="Filter">
        <div className="upp-filter-group">
          <span className="upp-filter-label">{t.location}</span>
          <div className="upp-chips">
            {([["all", t.allLocations], ["airport", `✈ ${t.airport}`], ["city", `🏙 ${t.city}`]] as [Location, string][]).map(([key, label]) => (
              <button key={key} className={`upp-chip${location === key ? " active" : ""}`} onClick={() => setLocation(key)}>{label}</button>
            ))}
          </div>
        </div>

        <div className="upp-filter-group">
          <span className="upp-filter-label">{t.rating}</span>
          <div className="upp-chips">
            {([["all", t.allRatings], ["9", t.r9], ["8.5", t.r85], ["8", t.r8]] as [string, string][]).map(([key, label]) => (
              <button key={key} className={`upp-chip${minRating === key ? " active" : ""}`} onClick={() => setMinRating(key)}>{label}</button>
            ))}
          </div>
        </div>

        <div className="upp-filter-group">
          <span className="upp-filter-label">{t.category}</span>
          <div className="upp-chips">
            {([["all", t.allLocations], ["small", t.sizeSmall], ["medium", t.sizeMedium], ["large", t.sizeLarge]] as [SizeGroup, string][]).map(([key, label]) => (
              <button key={key} className={`upp-chip${size === key ? " active" : ""}`} onClick={() => setSize(key)}>{label}</button>
            ))}
          </div>
        </div>

        <div className="upp-filter-group">
          <span className="upp-filter-label">{t.supplier}</span>
          <div className="upp-chips">
            <button className={`upp-chip${supplier === "all" ? " active" : ""}`} onClick={() => setSupplier("all")}>{t.allSuppliers}</button>
            {SUPPLIERS.map((s) => (
              <button key={s} className={`upp-chip${supplier === s ? " active" : ""}`} onClick={() => setSupplier(s)}>{s}</button>
            ))}
          </div>
        </div>

        <div className="upp-filter-group upp-sort">
          <span className="upp-filter-label">{t.sort}</span>
          <div className="upp-sort-pill">
            <span>{sort === "popular" ? t.popular : sort === "price-asc" ? t.priceAsc : sort === "price-desc" ? t.priceDesc : t.ratingSort}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label={t.sort}>
              <option value="popular">{t.popular}</option>
              <option value="price-asc">{t.priceAsc}</option>
              <option value="price-desc">{t.priceDesc}</option>
              <option value="rating">{t.ratingSort}</option>
            </select>
          </div>
        </div>
      </section>

      <div className="upp-count-row">
        <p className="upp-count">{t.showing((page - 1) * PER_PAGE + 1, Math.min(page * PER_PAGE, filtered.length), filtered.length)}</p>
      </div>

      {filtered.length === 0 ? (
        <div className="upp-empty">
          <p>{t.empty}</p>
          <button className="upp-reset" onClick={resetFilters}>{t.reset}</button>
        </div>
      ) : (
        <>
          <section className="hb-grid">
            {paginated.map((car) => (
              <a key={car.id} href="https://www.discovercars.com/se/sweden/malm?a_aid=discovergruppen" target="_blank" rel="noopener noreferrer sponsored" className="hb-card">
                <div className="hb-card-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={car.image} alt={car.name} className="hb-card-img" loading="lazy" />
                  <span className="hb-card-rating-badge">
                    {car.supplierRating.toFixed(1)} <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d="M6 1l1.39 2.82L10.5 4.27l-2.25 2.19.53 3.1L6 8l-2.78 1.56.53-3.1L1.5 4.27l3.11-.45z"/></svg>
                  </span>
                  <span className={`hb-card-loc-tag ${car.isAirport ? "airport" : "city"}`}>
                    {car.isAirport ? `✈ ${t.airport}` : `🏙 ${t.city}`}
                  </span>
                </div>

                <div className="hb-card-body">
                  <div className="hb-card-meta">
                    <span className="hb-card-category">{car.category}</span>
                    <span className="hb-card-supplier">{car.supplier}</span>
                  </div>

                  <h3 className="hb-card-title">{car.name}</h3>

                  <div className="hb-card-specs">
                    <span>👥 {car.seats} {t.seats}</span>
                    <span>⚙️ {car.transmission}</span>
                    <span>🛣 {t.unlimited}</span>
                  </div>

                  <div className="hb-card-footer">
                    <div className="hb-card-price-wrap">
                      <span className="hb-card-price">{car.pricePerDay.toLocaleString("sv-SE")} kr</span>
                      <span className="hb-card-price-unit">{t.perDay}</span>
                    </div>
                    <span className="hb-book-btn">Visa</span>
                  </div>
                </div>
              </a>
            ))}
          </section>

          {totalPages > 1 && (
            <nav className="upp-pagination" aria-label="Sidnavigation">
              <button className="upp-page-btn" onClick={() => goToPage(page - 1)} disabled={page === 1} aria-label={t.prev}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const show = p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                const showDot = (p === 2 && page > 4) || (p === totalPages - 1 && page < totalPages - 3);
                if (!show && !showDot) return null;
                if (showDot && !show) return <span key={p} className="upp-page-dots">…</span>;
                return (
                  <button key={p} className={`upp-page-btn${page === p ? " active" : ""}`} onClick={() => goToPage(p)} aria-label={`Sida ${p}`} aria-current={page === p ? "page" : undefined}>{p}</button>
                );
              })}
              <button className="upp-page-btn" onClick={() => goToPage(page + 1)} disabled={page === totalPages} aria-label={t.next}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </nav>
          )}
        </>
      )}

      <div className="hb-disclaimer">
        <p>Priser hämtade från Discover Cars. Klicka på en bil för aktuellt pris och bokning.</p>
      </div>
    </div>
  );
}
