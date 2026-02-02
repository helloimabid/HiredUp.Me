import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get("title") || "Job Opening";
  const company = searchParams.get("company") || "Company";
  const location = searchParams.get("location") || "Remote";
  const salary = searchParams.get("salary") || "";
  const type = searchParams.get("type") || "Full-time";

  // Get first letter of company for logo placeholder
  const companyInitial = company.charAt(0).toUpperCase();

  // Generate consistent color based on company name
  const colors = [
    ["#10B981", "#059669"], // green
    ["#3B82F6", "#2563EB"], // blue
    ["#8B5CF6", "#7C3AED"], // purple
    ["#F59E0B", "#D97706"], // amber
    ["#EC4899", "#DB2777"], // pink
    ["#14B8A6", "#0D9488"], // teal
    ["#6366F1", "#4F46E5"], // indigo
  ];
  const colorIndex = company.charCodeAt(0) % colors.length;
  const [primaryColor, secondaryColor] = colors[colorIndex];

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f8fafc",
        padding: "60px",
      }}
    >
      {/* Top bar with gradient */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "8px",
          background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
        }}
      />

      {/* Header with logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "40px",
        }}
      >
        {/* Company Logo Placeholder */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "16px",
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "36px",
              fontWeight: "700",
            }}
          >
            {companyInitial}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span
              style={{
                fontSize: "28px",
                fontWeight: "600",
                color: "#1e293b",
              }}
            >
              {company}
            </span>
            <span
              style={{
                fontSize: "18px",
                color: "#64748b",
              }}
            >
              is hiring
            </span>
          </div>
        </div>

        {/* HiredUp.me Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              backgroundColor: "#1e293b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "20px",
            }}
          >
            ↗
          </div>
          <span
            style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "#1e293b",
            }}
          >
            hiredup.me
          </span>
        </div>
      </div>

      {/* Job Title */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <h1
          style={{
            fontSize: title.length > 40 ? "48px" : "56px",
            fontWeight: "700",
            color: "#0f172a",
            lineHeight: 1.2,
            marginBottom: "24px",
            maxWidth: "90%",
          }}
        >
          {title}
        </h1>

        {/* Job Details */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >
          {/* Location */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              backgroundColor: "#e2e8f0",
              borderRadius: "100px",
            }}
          >
            <span style={{ fontSize: "20px" }}>📍</span>
            <span
              style={{
                fontSize: "20px",
                color: "#475569",
                fontWeight: "500",
              }}
            >
              {location}
            </span>
          </div>

          {/* Job Type */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              backgroundColor: "#e2e8f0",
              borderRadius: "100px",
            }}
          >
            <span style={{ fontSize: "20px" }}>💼</span>
            <span
              style={{
                fontSize: "20px",
                color: "#475569",
                fontWeight: "500",
              }}
            >
              {type}
            </span>
          </div>

          {/* Salary if provided */}
          {salary && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 20px",
                backgroundColor: "#dcfce7",
                borderRadius: "100px",
              }}
            >
              <span style={{ fontSize: "20px" }}>💰</span>
              <span
                style={{
                  fontSize: "20px",
                  color: "#166534",
                  fontWeight: "500",
                }}
              >
                {salary}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #e2e8f0",
          paddingTop: "24px",
        }}
      >
        <span
          style={{
            fontSize: "18px",
            color: "#64748b",
          }}
        >
          Apply now at hiredup.me
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            backgroundColor: primaryColor,
            borderRadius: "8px",
            color: "white",
            fontSize: "18px",
            fontWeight: "600",
          }}
        >
          View Job →
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
