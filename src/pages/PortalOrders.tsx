import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useApi } from "@/hooks/use-api";
import { api } from "@/lib/api";

const PortalOrders = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/web/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link
            to="/portal"
            className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("common.back") || "Volver"}
          </Link>

          <div className="flex items-center gap-3 mb-12">
            <ShoppingBag className="w-8 h-8 text-primary" />
            <div>
              <h1 className="font-display text-4xl font-bold text-foreground">{t("portal.orders")}</h1>
              <p className="text-muted-foreground mt-1">{t("portal.ordersDesc")}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border p-12 bg-card text-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">{t("common.noData") || "No tienes pedidos aún"}</p>
            <p className="text-muted-foreground/70 text-sm mt-2">
              {t("common.exploreShop") || "Explora nuestra tienda para hacer tu primer compra"}
            </p>
            <Link
              to="/shop"
              className="inline-block mt-6 px-6 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              {t("nav.shop") || "Ir a la Tienda"}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PortalOrders;
