import { TrendingUp, Users, Trophy, Calendar } from "lucide-react";

const Impact = () => {
  const stats = [
    {
      icon: Trophy,
      value: "50+",
      label: "College Scholarships",
      description: "Students placed at universities across the nation",
    },
    {
      icon: Users,
      value: "100+",
      label: "Veterans Served",
      description: "Military heroes through our golf rehabilitation program",
    },
    {
      icon: Calendar,
      value: "10+",
      label: "Years of Service",
      description: "Dedicated to empowering lives through golf",
    },
    {
      icon: TrendingUp,
      value: "$1M+",
      label: "Scholarships Secured",
      description: "In total scholarship value for our student-athletes",
    },
  ];

  return (
    <section className="section-padding bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-white/80 font-semibold uppercase tracking-wider text-sm">Our Impact</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mt-4 mb-6">
            Making a Difference
          </h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Every donation helps us expand our reach and create more opportunities for 
            aspiring athletes and veterans alike.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center border border-white/10 hover:bg-white/20 transition-colors duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="font-display text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">
                {stat.label}
              </h3>
              <p className="text-white/85 text-sm">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Impact;
