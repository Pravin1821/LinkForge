import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";

const AuthForm = ({
  fields,
  formData,
  onChange,
  onSubmit,
  loading,
  buttonText,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {fields.map((field, index) => (
        <motion.div
          key={field.name}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 + index * 0.05 }}
        >
          <label className="mb-1.5 block text-xs font-medium text-primary">
            {field.label}
          </label>
          <input
            type={field.type}
            name={field.name}
            value={formData[field.name]}
            onChange={onChange}
            placeholder={field.placeholder}
            autoComplete={
              field.name === "email"
                ? "email"
                : field.name === "password"
                  ? "current-password"
                  : field.name === "name"
                    ? "name"
                    : undefined
            }
            className="auth-input input-field h-11 transition-shadow duration-150 focus:shadow-[0_0_0_3px_rgb(0_0_0_0.06)]"
          />
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <button
          type="submit"
          disabled={loading}
          className="group flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent)] text-sm font-semibold text-[var(--bg-surface)] shadow-[0_2px_8px_rgb(0_0_0_0.12)] transition-all duration-150 hover:bg-[var(--accent-hover)] hover:shadow-[0_4px_14px_rgb(0_0_0_0.14)] disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {buttonText}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </motion.div>
    </form>
  );
};

export default AuthForm;
